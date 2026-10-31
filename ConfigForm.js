
const LIMITS = Object.freeze({
  name: 60
});

const ALLOWED_LANGUAGES = Object.freeze([
  "pt-BR",
  "en",
  "es"
]);

const ALLOWED_QUALITIES = Object.freeze([
  "4k",
  "1080p",
  "720p",
  "480p"
]);

const DEFAULTS = Object.freeze({
  name: "",
  language: "pt-BR",
  quality: "1080p",
  subtitles: true,
  enabled: true
});

function normalizeName(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, LIMITS.name);
}

function collectFormData(form) {
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError("Formulário inválido.");
  }

  const formData = new FormData(form);

  const name = normalizeName(formData.get("name"));
  const language = formData.get("language");
  const quality = formData.get("quality");

  if (!ALLOWED_LANGUAGES.includes(language)) {
    throw new Error("Selecione um idioma válido.");
  }

  if (!ALLOWED_QUALITIES.includes(quality)) {
    throw new Error("Selecione uma qualidade válida.");
  }

  return Object.freeze({
    name,
    language,
    quality,
    subtitles: formData.get("subtitles") === "on",
    enabled: formData.get("enabled") === "on"
  });
}

function createElement(tag, attributes = {}, text = "") {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attributes)) {
    if (key === "className") {
      element.className = value;
    } else if (key === "textContent") {
      element.textContent = value;
    } else {
      element.setAttribute(key, String(value));
    }
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

export function ConfigForm({
  onChange = () => {},
  onSubmit = () => {}
} = {}) {
  if (typeof onChange !== "function") {
    throw new TypeError("onChange precisa ser uma função.");
  }

  if (typeof onSubmit !== "function") {
    throw new TypeError("onSubmit precisa ser uma função.");
  }

  const form = document.createElement("form");

  form.className = "config-form";
  form.noValidate = true;
  form.autocomplete = "off";

  form.innerHTML = `
    <div class="form-header">
      <h2>Configurar BRTorrents</h2>
      <p>Personalize as preferências do seu addon.</p>
    </div>

    <div class="form-group">
      <label for="config-name">Nome da configuração</label>
      <input
        id="config-name"
        name="name"
        type="text"
        maxlength="${LIMITS.name}"
        placeholder="Minha configuração"
        autocomplete="off"
      >
      <small>Máximo de ${LIMITS.name} caracteres.</small>
    </div>

    <div class="form-group">
      <label for="config-language">Idioma</label>
      <select id="config-language" name="language" required>
        <option value="pt-BR">Português (Brasil)</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>

    <div class="form-group">
      <label for="config-quality">Qualidade preferida</label>
      <select id="config-quality" name="quality" required>
        <option value="4k">4K</option>
        <option value="1080p" selected>1080p</option>
        <option value="720p">720p</option>
        <option value="480p">480p</option>
      </select>
    </div>

    <div class="form-options">
      <label class="form-checkbox">
        <input
          type="checkbox"
          name="subtitles"
          checked
        >
        <span>Preferir legendas</span>
      </label>

      <label class="form-checkbox">
        <input
          type="checkbox"
          name="enabled"
          checked
        >
        <span>Ativar configuração</span>
      </label>
    </div>

    <button type="submit" class="config-submit">
      Salvar configuração
    </button>

    <p
      class="form-status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    ></p>
  `;

  const nameInput = form.querySelector("#config-name");
  const status = form.querySelector(".form-status");
  const submitButton = form.querySelector('[type="submit"]');

  function showStatus(message, type = "info") {
    status.textContent = message;
    status.dataset.state = type;
  }

  function notifyChange() {
    try {
      const data = collectFormData(form);
      onChange(data);
      showStatus("");
    } catch (error) {
      showStatus(error.message, "error");
    }
  }

  form.addEventListener("input", notifyChange);
  form.addEventListener("change", notifyChange);

  nameInput.addEventListener("blur", () => {
    nameInput.value = normalizeName(nameInput.value);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitButton.disabled) {
      return;
    }

    let data;

    try {
      data = collectFormData(form);
    } catch (error) {
      showStatus(error.message, "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    showStatus("Salvando configuração...", "loading");

    try {
      await onSubmit(data);
      showStatus("Configuração salva com sucesso!", "success");
    } catch (error) {
      showStatus(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a configuração.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
    }
  });

  return form;
}
