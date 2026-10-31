
const LANGUAGES = Object.freeze({
  "pt-BR": "Português (Brasil)",
  en: "English",
  es: "Español"
});

const QUALITIES = Object.freeze({
  "4k": "4K",
  "1080p": "1080p",
  "720p": "720p",
  "480p": "480p"
});

const DEFAULTS = Object.freeze({
  name: "",
  language: "pt-BR",
  quality: "1080p",
  subtitles: true,
  enabled: true
});

function normalizeData(data = {}) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    data = {};
  }

  const name =
    typeof data.name === "string"
      ? data.name.normalize("NFC").trim().replace(/\s+/g, " ").slice(0, 60)
      : DEFAULTS.name;

  const language = Object.hasOwn(LANGUAGES, data.language)
    ? data.language
    : DEFAULTS.language;

  const quality = Object.hasOwn(QUALITIES, data.quality)
    ? data.quality
    : DEFAULTS.quality;

  return Object.freeze({
    name,
    language,
    quality,
    subtitles: typeof data.subtitles === "boolean"
      ? data.subtitles
      : DEFAULTS.subtitles,
    enabled: typeof data.enabled === "boolean"
      ? data.enabled
      : DEFAULTS.enabled
  });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  element.textContent = text;

  return element;
}

function createPreviewRow(label, value) {
  const row = createElement("div", "preview-row", "");

  const labelElement = createElement(
    "span",
    "preview-label",
    label
  );

  const valueElement = createElement(
    "strong",
    "preview-value",
    value
  );

  row.append(labelElement, valueElement);

  return row;
}

function buildPreview(data) {
  const container = createElement("section", "config-preview", "");

  container.setAttribute("aria-label", "Prévia da configuração");

  const header = createElement("div", "preview-header", "");

  const title = createElement(
    "h3",
    "preview-title",
    "Prévia da configuração"
  );

  const description = createElement(
    "p",
    "preview-description",
    "Confira suas preferências antes de salvar."
  );

  header.append(title, description);

  const content = createElement("div", "preview-content", "");

  const displayName = data.name || "Minha configuração";

  content.append(
    createPreviewRow("Nome", displayName),
    createPreviewRow("Idioma", LANGUAGES[data.language]),
    createPreviewRow("Qualidade", QUALITIES[data.quality]),
    createPreviewRow(
      "Legendas",
      data.subtitles ? "Preferidas" : "Desativadas"
    ),
    createPreviewRow(
      "Status",
      data.enabled ? "Ativada" : "Desativada"
    )
  );

  const footer = createElement(
    "p",
    "preview-footer",
    "As preferências serão aplicadas conforme as fontes disponíveis."
  );

  container.append(header, content, footer);

  return container;
}

export function Preview(initialData = {}) {
  const data = normalizeData(initialData);

  return buildPreview(data);
}

export function updatePreview(section, input = {}) {
  if (!(section instanceof HTMLElement)) {
    throw new TypeError("Elemento de prévia inválido.");
  }

  const data = normalizeData(input);
  const newPreview = buildPreview(data);

  section.replaceChildren(...newPreview.childNodes);

  section.className = newPreview.className;
  section.setAttribute(
    "aria-label",
    newPreview.getAttribute("aria-label")
  );

  return data;
}
