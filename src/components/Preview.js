
const CATALOGS = Object.freeze([
  "populares_movie",
  "populares_series",
  "recentes_movie",
  "recentes_series"
]);

const DEFAULTS = Object.freeze({
  qualities: ["4k", "1080p", "720p", "sd"],
  audio: ["dublado", "legendado"]
});

const ALLOWED_QUALITIES = new Set(["4k", "1080p", "720p", "sd"]);
const ALLOWED_AUDIO = new Set(["dublado", "legendado"]);

/*
 * IMPORTANTE:
 * Configure aqui o domínio REAL do backend do addon.
 * Não coloque o domínio do GitHub Pages.
 */
export const ADDON_BASE_URL = "https://SEU-DOMINIO-DO-ADDON";

export function buildManifestUrl(data = {}) {
  const qualities = Array.isArray(data.qualities)
    ? data.qualities.filter(value => ALLOWED_QUALITIES.has(value))
    : DEFAULTS.qualities;

  const audio = Array.isArray(data.audio)
    ? data.audio.filter(value => ALLOWED_AUDIO.has(value))
    : DEFAULTS.audio;

  const selectedQualities = qualities.length
    ? qualities.join(",")
    : DEFAULTS.qualities.join(",");

  const selectedAudio = audio.length
    ? audio.join(",")
    : DEFAULTS.audio.join(",");

  const base = ADDON_BASE_URL.replace(/\/+$/, "");

  return (
    `${base}/qualities=${selectedQualities}` +
    `%7Caudio=${selectedAudio}` +
    `%7Ccatalogs=${CATALOGS.join(",")}` +
    `/manifest.json`
  );
}

function createElement(tag, className = "", text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function createIcon(symbol, className = "manifest-action-icon") {
  const icon = createElement("span", className, symbol);
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function buildPreview(data = {}, actions = {}) {
  const section = createElement("section", "config-preview");
  section.setAttribute("aria-label", "Preview do Manifest");

  const header = createElement("div", "manifest-preview-header");

  const identity = createElement("div", "manifest-identity");

  const icon = createElement("div", "manifest-main-icon", "{}");
  icon.setAttribute("aria-hidden", "true");

  const titleGroup = createElement("div", "manifest-title-group");

  titleGroup.append(
    createElement("h3", "preview-title", "Preview do Manifest"),
    createElement(
      "p",
      "preview-description",
      "Seu endereço de instalação será gerado automaticamente."
    )
  );

  identity.append(icon, titleGroup);

  const status = createElement("span", "manifest-status");
  status.append(
    createIcon("●", "manifest-status-dot"),
    createElement("span", "", "PRONTO")
  );

  header.append(identity, status);

  const urlArea = createElement("div", "manifest-url-area");

  const urlHeading = createElement("div", "manifest-url-heading");
  urlHeading.append(
    createElement("span", "manifest-url-label", "ENDEREÇO DO MANIFEST"),
    createElement("span", "manifest-url-type", "JSON")
  );

  const urlBox = createElement("div", "manifest-url-box");

  const url = buildManifestUrl(data);
  const urlText = createElement("code", "manifest-url", url);

  urlText.setAttribute("aria-label", "Endereço do Manifest");
  urlText.setAttribute("tabindex", "0");

  urlBox.append(urlText);
  urlArea.append(urlHeading, urlBox);

  const footer = createElement("div", "manifest-preview-footer");

  const footerIndicator = createElement("span", "manifest-footer-indicator");
  footerIndicator.setAttribute("aria-hidden", "true");

  const footerText = createElement(
    "p",
    "",
    "A URL acompanha automaticamente suas escolhas."
  );

  footer.append(footerIndicator, footerText);

  const actionsContainer = createElement("div", "manifest-actions");

  const installButton = createElement(
    "button",
    "manifest-install-button"
  );

  installButton.type = "button";
  installButton.append(
    createIcon("↗"),
    createElement("span", "", "Instalar no Stremio / Nuvio")
  );

  installButton.addEventListener("click", () => {
    if (typeof actions.onInstall === "function") {
      actions.onInstall(url);
    }
  });

  const copyButton = createElement(
    "button",
    "manifest-copy-button"
  );

  copyButton.type = "button";
  copyButton.append(
    createIcon("⧉"),
    createElement("span", "", "Copiar Manifest")
  );

  copyButton.addEventListener("click", async () => {
    if (typeof actions.onCopy === "function") {
      await actions.onCopy(url);
    }
  });

  actionsContainer.append(installButton, copyButton);

  section.append(
    header,
    urlArea,
    footer,
    actionsContainer
  );

  return section;
}

export function Preview(initialData = {}, actions = {}) {
  return buildPreview(initialData, actions);
}

export function updatePreview(section, data = {}, actions = {}) {
  if (!(section instanceof HTMLElement)) {
    throw new TypeError("Elemento de preview inválido.");
  }

  const updated = buildPreview(data, actions);
  section.replaceWith(updated);

  return updated;
}
