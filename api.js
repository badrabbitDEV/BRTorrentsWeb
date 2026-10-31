
/* =========================================================
   BRTORRENTS — API CLIENT
   Version: 1.0.0
   Environment: Browser / Vercel
   Purpose: Secure communication with BRTorrents API
   ========================================================= */

/*
  CONFIGURAÇÃO DA API

  Defina no index.html:

  <meta
    name="brt-api-base"
    content="https://SEU-SERVIDOR-API"
  >

  Não coloque chaves secretas, senhas ou tokens
  administrativos neste arquivo ou no HTML público.
*/

const API_CONFIG = Object.freeze({
  BASE_URL_META: "brt-api-base",
  DEFAULT_TIMEOUT: 12000,
  MAX_TIMEOUT: 30000,
  MAX_RESPONSE_SIZE: 1024 * 1024,
  MAX_NAME_LENGTH: 60,
  ALLOWED_LANGUAGES: Object.freeze([
    "pt-BR",
    "en",
    "es"
  ]),
  ALLOWED_QUALITIES: Object.freeze([
    "4k",
    "1080p",
    "720p",
    "480p"
  ])
});

/* =========================================================
   01. ERROS CONTROLADOS
   ========================================================= */

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);

    this.name = "ApiError";
    this.status = options.status ?? 0;
    this.code = options.code ?? "API_ERROR";
    this.details = options.details ?? null;
  }
}

/* =========================================================
   02. CONFIGURAÇÃO DA URL
   ========================================================= */

function getApiBaseUrl() {
  if (typeof document === "undefined") {
    throw new ApiError(
      "O cliente da API precisa ser executado no navegador.",
      { code: "BROWSER_REQUIRED" }
    );
  }

  const meta = document.querySelector(
    `meta[name="${API_CONFIG.BASE_URL_META}"]`
  );

  const configuredUrl = meta?.content?.trim();

  if (!configuredUrl) {
    throw new ApiError(
      "A URL da API ainda não foi configurada.",
      { code: "API_URL_MISSING" }
    );
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(configuredUrl);
  } catch {
    throw new ApiError(
      "A URL da API configurada é inválida.",
      { code: "API_URL_INVALID" }
    );
  }

  const isLocalhost = [
    "localhost",
    "127.0.0.1"
  ].includes(parsedUrl.hostname);

  if (
    parsedUrl.protocol !== "https:" &&
    !(isLocalhost && parsedUrl.protocol === "http:")
  ) {
    throw new ApiError(
      "A API precisa utilizar uma conexão HTTPS.",
      { code: "HTTPS_REQUIRED" }
    );
  }

  if (parsedUrl.username || parsedUrl.password) {
    throw new ApiError(
      "A URL da API não pode conter credenciais.",
      { code: "URL_CREDENTIALS_FORBIDDEN" }
    );
  }

  if (parsedUrl.search || parsedUrl.hash) {
    throw new ApiError(
      "A URL base da API não pode conter parâmetros ou fragmentos.",
      { code: "URL_PARAMETERS_FORBIDDEN" }
    );
  }

  return parsedUrl.href.replace(/\/+$/, "");
}

/* =========================================================
   03. VALIDAÇÃO DE CAMINHOS
   ========================================================= */

function normalizePath(path) {
  if (
    typeof path !== "string" ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\")
  ) {
    throw new ApiError(
      "Caminho de API inválido.",
      { code: "INVALID_PATH" }
    );
  }

  if (
    /[\u0000-\u001F\u007F]/.test(path) ||
    path.includes("..")
  ) {
    throw new ApiError(
      "O caminho contém caracteres não permitidos.",
      { code: "UNSAFE_PATH" }
    );
  }

  return path;
}

/* =========================================================
   04. CONTROLE DE TIMEOUT
   ========================================================= */

function normalizeTimeout(timeout) {
  if (
    !Number.isFinite(timeout) ||
    timeout <= 0
  ) {
    return API_CONFIG.DEFAULT_TIMEOUT;
  }

  return Math.min(
    timeout,
    API_CONFIG.MAX_TIMEOUT
  );
}

/* =========================================================
   05. LEITURA SEGURA DA RESPOSTA
   ========================================================= */

async function readResponse(response) {
  const contentType = (
    response.headers.get("content-type") || ""
  ).toLowerCase();

  const contentLength = Number(
    response.headers.get("content-length") || 0
  );

  if (
    Number.isFinite(contentLength) &&
    contentLength > API_CONFIG.MAX_RESPONSE_SIZE
  ) {
    throw new ApiError(
      "A resposta do servidor é muito grande.",
      {
        status: response.status,
        code: "RESPONSE_TOO_LARGE"
      }
    );
  }

  if (!contentType.includes("application/json")) {
    throw new ApiError(
      "O servidor retornou um formato inesperado.",
      {
        status: response.status,
        code: "INVALID_CONTENT_TYPE"
      }
    );
  }

  const text = await response.text();

  if (text.length > API_CONFIG.MAX_RESPONSE_SIZE) {
    throw new ApiError(
      "A resposta do servidor excedeu o limite permitido.",
      {
        status: response.status,
        code: "RESPONSE_TOO_LARGE"
      }
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(
      "Não foi possível interpretar a resposta do servidor.",
      {
        status: response.status,
        code: "INVALID_JSON"
      }
    );
  }
}

/* =========================================================
   06. MENSAGENS DE ERRO
   ========================================================= */

function getSafeErrorMessage(status) {
  const messages = {
    400: "Os dados enviados são inválidos.",
    401: "É necessário autenticar a solicitação.",
    403: "Você não tem permissão para realizar esta ação.",
    404: "O recurso solicitado não foi encontrado.",
    408: "A solicitação demorou demais.",
    409: "Ocorreu um conflito ao processar a solicitação.",
    413: "Os dados enviados são muito grandes.",
    422: "Os dados não passaram pela validação.",
    429: "Muitas solicitações. Aguarde um pouco.",
    500: "O servidor encontrou um erro interno.",
    502: "O servidor está temporariamente indisponível.",
    503: "O serviço está indisponível no momento.",
    504: "O servidor demorou demais para responder."
  };

  return messages[status] ||
    "Não foi possível concluir a solicitação.";
}

/* =========================================================
   07. CLIENTE HTTP
   ========================================================= */

async function request(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const safePath = normalizePath(path);

  const method = String(
    options.method || "GET"
  ).toUpperCase();

  const allowedMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ];

  if (!allowedMethods.includes(method)) {
    throw new ApiError(
      "Método HTTP não permitido.",
      { code: "METHOD_NOT_ALLOWED" }
    );
  }

  const timeout = normalizeTimeout(
    options.timeout
  );

  const controller = new AbortController();

  let timeoutId;

  const externalSignal = options.signal;

  if (externalSignal?.aborted) {
    throw new ApiError(
      "Solicitação cancelada.",
      { code: "REQUEST_ABORTED" }
    );
  }

  const abortFromExternalSignal = () => {
    controller.abort();
  };

  if (externalSignal) {
    externalSignal.addEventListener(
      "abort",
      abortFromExternalSignal,
      { once: true }
    );
  }

  timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const headers = new Headers();

    headers.set(
      "Accept",
      "application/json"
    );

    let body;

    if (options.body !== undefined) {
      headers.set(
        "Content-Type",
        "application/json"
      );

      body = JSON.stringify(options.body);
    }

    const response = await fetch(
      `${baseUrl}${safePath}`,
      {
        method,
        headers,
        body,
        signal: controller.signal,

        // Não enviar cookies ou credenciais do navegador.
        credentials: "omit",

        // Não seguir redirecionamentos inesperados.
        redirect: "error",

        // Evitar enviar a URL da página como referenciadora.
        referrerPolicy: "no-referrer",

        // Solicitações cross-origin exigem CORS configurado na API.
        mode: "cors",

        cache: "no-store"
      }
    );

    const data = await readResponse(response);

    if (!response.ok) {
      throw new ApiError(
        getSafeErrorMessage(response.status),
        {
          status: response.status,
          code: "HTTP_ERROR"
        }
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (controller.signal.aborted) {
      const wasExternallyAborted =
        externalSignal?.aborted === true;

      throw new ApiError(
        wasExternallyAborted
          ? "Solicitação cancelada."
          : "A solicitação excedeu o tempo limite.",
        {
          code: wasExternallyAborted
            ? "REQUEST_ABORTED"
            : "REQUEST_TIMEOUT"
        }
      );
    }

    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão.",
      { code: "NETWORK_ERROR" }
    );
  } finally {
    clearTimeout(timeoutId);

    externalSignal?.removeEventListener(
      "abort",
      abortFromExternalSignal
    );
  }
}

/* =========================================================
   08. VALIDAÇÃO DA CONFIGURAÇÃO
   ========================================================= */

function validateConfiguration(input) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    throw new ApiError(
      "Configuração inválida.",
      { code: "INVALID_CONFIGURATION" }
    );
  }

  const name = typeof input.name === "string"
    ? input.name
        .normalize("NFC")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, API_CONFIG.MAX_NAME_LENGTH)
    : "";

  const language = input.language;
  const quality = input.quality;

  if (
    !API_CONFIG.ALLOWED_LANGUAGES.includes(language)
  ) {
    throw new ApiError(
      "Idioma não permitido.",
      { code: "INVALID_LANGUAGE" }
    );
  }

  if (
    !API_CONFIG.ALLOWED_QUALITIES.includes(quality)
  ) {
    throw new ApiError(
      "Qualidade não permitida.",
      { code: "INVALID_QUALITY" }
    );
  }

  if (
    typeof input.subtitles !== "boolean" ||
    typeof input.enabled !== "boolean"
  ) {
    throw new ApiError(
      "As opções da configuração são inválidas.",
      { code: "INVALID_OPTIONS" }
    );
  }

  // Lista permitida: propriedades desconhecidas são descartadas.
  return Object.freeze({
    name,
    language,
    quality,
    subtitles: input.subtitles,
    enabled: input.enabled
  });
}

/* =========================================================
   09. VALIDAÇÃO DO IDENTIFICADOR
   ========================================================= */

function validateConfigId(id) {
  if (
    typeof id !== "string" ||
    id.length < 8 ||
    id.length > 128 ||
    !/^[a-zA-Z0-9_-]+$/.test(id)
  ) {
    throw new ApiError(
      "Identificador de configuração inválido.",
      { code: "INVALID_CONFIG_ID" }
    );
  }

  return encodeURIComponent(id);
}

/* =========================================================
   10. SERVIÇO DE CONFIGURAÇÕES
   ========================================================= */

export const configApi = Object.freeze({

  /**
   * Cria uma configuração.
   *
   * Endpoint esperado:
   * POST /api/config
   *
   * O contrato definitivo deverá ser implementado
   * e validado também no servidor.
   */
  async create(input, options = {}) {
    const configuration = validateConfiguration(input);

    return request(
      "/api/config",
      {
        method: "POST",
        body: configuration,
        signal: options.signal,
        timeout: options.timeout
      }
    );
  },

  /**
   * Consulta uma configuração pelo identificador.
   *
   * Endpoint esperado:
   * GET /api/config/:id
   *
   * O servidor deve verificar se o usuário pode
   * acessar a configuração solicitada.
   */
  async get(id, options = {}) {
    const safeId = validateConfigId(id);

    return request(
      `/api/config/${safeId}`,
      {
        method: "GET",
        signal: options.signal,
        timeout: options.timeout
      }
    );
  }

});

/* =========================================================
   11. SERVIÇO DE SAÚDE DA API
   ========================================================= */

export const healthApi = Object.freeze({

  /**
   * Verifica se a API está respondendo.
   *
   * Endpoint esperado:
   * GET /api/health
   */
  async check(options = {}) {
    return request(
      "/api/health",
      {
        method: "GET",
        signal: options.signal,
        timeout: options.timeout
      }
    );
  }

});

/* =========================================================
   12. EXPORTAÇÕES GERAIS
   ========================================================= */

export const api = Object.freeze({
  request,
  config: configApi,
  health: healthApi
});

export default api;
