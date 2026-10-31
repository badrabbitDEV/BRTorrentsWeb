
/* =========================================================
   BRTORRENTS — APPLICATION CORE
   Version: 1.1.0
   Vite + Vanilla JavaScript
   GitHub Pages compatible
   ========================================================= */

import "./styles/global.css";
import "./styles/components.css";

import { Home } from "./pages/home.js";
import { Configure } from "./pages/configure.js";
import { NotFound } from "./pages/not-found.js";

/* =========================================================
   01. CONFIGURAÇÃO
   ========================================================= */

const APP_CONFIG = Object.freeze({
  name: "BRTorrents",
  version: "1.1.0",
  rootSelector: "#app",
  defaultRoute: "/",
  configureRoute: "/configure",
  notFoundRoute: "/404"
});

/*
 * O Vite fornece BASE_URL conforme o vite.config.js.
 * Exemplo: /BRTorrentsWeb/
 */

const BASE_URL = import.meta.env.BASE_URL || "/";
const BASE_PATH =
  BASE_URL === "/"
    ? ""
    : BASE_URL.replace(/\/+$/, "");

/* =========================================================
   02. ROTAS PERMITIDAS
   ========================================================= */

const ROUTES = Object.freeze({
  "/": Home,
  "/configure": Configure
});

/* =========================================================
   03. ESTADO DA APLICAÇÃO
   ========================================================= */

let appRoot = null;
let initialized = false;
let isRendering = false;

/* =========================================================
   04. NORMALIZAÇÃO DE CAMINHOS
   ========================================================= */

function normalizePath(pathname) {
  if (typeof pathname !== "string") {
    return APP_CONFIG.defaultRoute;
  }

  let path = pathname.trim();

  if (!path) {
    return APP_CONFIG.defaultRoute;
  }

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  // Remove barras duplicadas.
  path = path.replace(/\/{2,}/g, "/");

  // Remove barras finais, exceto na raiz.
  if (path.length > 1) {
    path = path.replace(/\/+$/, "");
  }

  return path || APP_CONFIG.defaultRoute;
}

/* =========================================================
   05. RESOLUÇÃO DO BASE PATH
   ========================================================= */

function getRouteFromPathname(pathname) {
  const path = normalizePath(pathname);

  // Compatibilidade com hospedagem na raiz.
  if (!BASE_PATH) {
    return path;
  }

  // Página inicial do GitHub Pages.
  if (
    path === BASE_PATH ||
    path === `${BASE_PATH}/`
  ) {
    return "/";
  }

  // Rotas dentro do diretório do projeto.
  if (path.startsWith(`${BASE_PATH}/`)) {
    return normalizePath(
      path.slice(BASE_PATH.length)
    );
  }

  /*
   * Compatibilidade com os links atuais do Header,
   * que utilizam "/" e "/configure".
   */
  if (
    path === "/" ||
    path === "/configure"
  ) {
    return path;
  }

  return path;
}

function getCurrentPath() {
  return getRouteFromPathname(
    window.location.pathname
  );
}

/* =========================================================
   06. CONSTRUÇÃO DE URL INTERNA
   ========================================================= */

function buildAppUrl(route) {
  const normalizedRoute = normalizePath(route);

  return `${BASE_PATH}${normalizedRoute === "/"
    ? "/"
    : normalizedRoute}`;
}

/* =========================================================
   07. VERIFICAÇÃO DE DESTINOS
   ========================================================= */

function isAppPath(pathname) {
  const path = normalizePath(pathname);

  if (!BASE_PATH) {
    return true;
  }

  return (
    path === BASE_PATH ||
    path.startsWith(`${BASE_PATH}/`) ||
    path === "/" ||
    path === "/configure"
  );
}

function isSafeInternalRoute(path) {
  if (typeof path !== "string") {
    return false;
  }

  if (!path.startsWith("/")) {
    return false;
  }

  if (path.startsWith("//")) {
    return false;
  }

  if (path.includes("\\")) {
    return false;
  }

  if (/[?#]/.test(path)) {
    return false;
  }

  return true;
}

/* =========================================================
   08. COMPONENTE DE ERRO
   ========================================================= */

function createErrorElement() {
  const container = document.createElement("section");

  container.className = "app-error";
  container.setAttribute("role", "alert");

  const title = document.createElement("h1");

  title.textContent =
    "Não foi possível abrir esta página.";

  const description = document.createElement("p");

  description.textContent =
    "Ocorreu um erro inesperado. Tente novamente.";

  const button = document.createElement("button");

  button.type = "button";
  button.className = "button button-primary";
  button.textContent = "Tentar novamente";

  button.addEventListener("click", () => {
    window.location.reload();
  });

  container.append(
    title,
    description,
    button
  );

  return container;
}

/* =========================================================
   09. RESOLUÇÃO DE COMPONENTES
   ========================================================= */

function resolveRoute(path) {
  const normalizedPath = normalizePath(path);

  return ROUTES[normalizedPath] || NotFound;
}

/* =========================================================
   10. TÍTULOS DAS PÁGINAS
   ========================================================= */

function updateDocumentTitle(path) {
  const titles = {
    "/": `${APP_CONFIG.name} — Início`,
    "/configure": `Configurador — ${APP_CONFIG.name}`
  };

  document.title =
    titles[path] ||
    `Página não encontrada — ${APP_CONFIG.name}`;
}

/* =========================================================
   11. NAVEGAÇÃO VISUAL
   ========================================================= */

function updateNavigation(currentPath) {
  if (!appRoot) {
    return;
  }

  const links = appRoot.querySelectorAll("a[href]");

  links.forEach((link) => {
    let destination;

    try {
      destination = new URL(
        link.href,
        window.location.href
      );
    } catch {
      return;
    }

    if (destination.origin !== window.location.origin) {
      return;
    }

    const route = getRouteFromPathname(
      destination.pathname
    );

    if (route === currentPath) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* =========================================================
   12. RENDERIZAÇÃO
   ========================================================= */

function renderPage(path = getCurrentPath()) {
  if (!appRoot || isRendering) {
    return;
  }

  isRendering = true;

  appRoot.setAttribute("aria-busy", "true");

  try {
    const normalizedPath = normalizePath(path);

    const PageComponent = resolveRoute(
      normalizedPath
    );

    let page;

    try {
      page = PageComponent();

      if (!(page instanceof Node)) {
        throw new TypeError(
          "O componente retornou um elemento inválido."
        );
      }
    } catch (error) {
      console.error(
        `[${APP_CONFIG.name}] Falha ao montar a página.`,
        error
      );

      page = createErrorElement();
    }

    appRoot.replaceChildren(page);

    updateDocumentTitle(normalizedPath);

    updateNavigation(normalizedPath);

    // Volta ao topo sem depender de animações.
    window.scrollTo(0, 0);

  } catch (error) {
    console.error(
      `[${APP_CONFIG.name}] Falha na renderização.`,
      error
    );

    appRoot.replaceChildren(
      createErrorElement()
    );

  } finally {
    appRoot.setAttribute("aria-busy", "false");

    isRendering = false;
  }
}

/* =========================================================
   13. NAVEGAÇÃO PROGRAMÁTICA
   ========================================================= */

function navigate(path) {
  if (!isSafeInternalRoute(path)) {
    return;
  }

  const normalizedPath = normalizePath(path);

  const destinationUrl = buildAppUrl(
    normalizedPath
  );

  // Evita operações desnecessárias no histórico.
  if (
    window.location.pathname === destinationUrl
  ) {
    renderPage(normalizedPath);
    return;
  }

  try {
    window.history.pushState(
      {
        app: APP_CONFIG.name,
        route: normalizedPath
      },
      "",
      destinationUrl
    );

    renderPage(normalizedPath);

  } catch (error) {
    console.error(
      `[${APP_CONFIG.name}] Falha na navegação.`,
      error
    );

    // Fallback para navegação tradicional.
    window.location.assign(destinationUrl);
  }
}

/* =========================================================
   14. INTERCEPTAÇÃO SEGURA DE LINKS
   ========================================================= */

function handleDocumentClick(event) {
  if (event.defaultPrevented) {
    return;
  }

  // Apenas cliques principais.
  if (event.button !== 0) {
    return;
  }

  // Preserva abrir em nova aba e atalhos do navegador.
  if (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const link = target.closest("a[href]");

  if (!link) {
    return;
  }

  if (
    link.target &&
    link.target !== "_self"
  ) {
    return;
  }

  if (
    link.hasAttribute("download") ||
    link.hasAttribute("data-no-router")
  ) {
    return;
  }

  let destination;

  try {
    destination = new URL(
      link.href,
      window.location.href
    );
  } catch {
    return;
  }

  // Não intercepta outros sites ou protocolos.
  if (
    destination.origin !== window.location.origin
  ) {
    return;
  }

  if (
    destination.protocol !== "http:" &&
    destination.protocol !== "https:"
  ) {
    return;
  }

  // Preserva parâmetros e âncoras convencionais.
  if (
    destination.search ||
    destination.hash
  ) {
    return;
  }

  // Só trata caminhos pertencentes ao aplicativo.
  if (!isAppPath(destination.pathname)) {
    return;
  }

  const route = getRouteFromPathname(
    destination.pathname
  );

  event.preventDefault();

  navigate(route);
}

/* =========================================================
   15. HISTÓRICO DO NAVEGADOR
   ========================================================= */

function handlePopState() {
  renderPage(getCurrentPath());
}

/* =========================================================
   16. ERROS GLOBAIS
   ========================================================= */

function handleGlobalError(event) {
  if (event.error) {
    console.error(
      `[${APP_CONFIG.name}] Erro inesperado.`
    );
  }
}

function handleUnhandledRejection() {
  console.error(
    `[${APP_CONFIG.name}] Uma operação assíncrona falhou.`
  );
}

/* =========================================================
   17. INICIALIZAÇÃO
   ========================================================= */

function initializeApp() {
  if (initialized) {
    return;
  }

  if (
    typeof window === "undefined" ||
    typeof document === "undefined"
  ) {
    return;
  }

  appRoot = document.querySelector(
    APP_CONFIG.rootSelector
  );

  if (!appRoot) {
    console.error(
      `[${APP_CONFIG.name}] Elemento principal não encontrado.`
    );

    return;
  }

  initialized = true;

  // Navegação interna.
  document.addEventListener(
    "click",
    handleDocumentClick
  );

  // Botões voltar e avançar.
  window.addEventListener(
    "popstate",
    handlePopState
  );

  // Tratamento de falhas.
  window.addEventListener(
    "error",
    handleGlobalError
  );

  window.addEventListener(
    "unhandledrejection",
    handleUnhandledRejection
  );

  // Primeira renderização.
  renderPage();

  // Identificação da aplicação.
  document.documentElement.dataset.app =
    APP_CONFIG.name.toLowerCase();

  document.documentElement.dataset.version =
    APP_CONFIG.version;
}

/* =========================================================
   18. EXECUÇÃO
   ========================================================= */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeApp,
    { once: true }
  );
} else {
  initializeApp();
     }
