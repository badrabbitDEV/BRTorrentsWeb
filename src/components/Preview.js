
const CATALOGS = Object.freeze([
  "populares_movie",
  "populares_series",
  "recentes_movie",
  "recentes_series"
]);

const DEFAULTS = Object.freeze({
  qualities: ["4k", "1080p", "720p", "sd"],
  audio: ["dublado", "legendado"],
  debrid: "none",
  apiKey: ""
});

/*
 * IMPORTANTE:
 * Troque pelo domínio real do addon quando o backend estiver publicado.
 * Não use o domínio do GitHub Pages aqui.
 */
export const ADDON_BASE_URL = "https://SEU-DOMINIO-DO-ADDON";

export function buildManifestUrl(data = {}) {
  const qualities = Array.isArray(data.qualities)
    ? data.qualities.filter(value =>
        ["4k", "1080p", "720p", "sd"].includes(value)
      )
    : DEFAULTS.qualities;

  const audio = Array.isArray(data.audio)
    ? data.audio.filter(value =>
        ["dublado", "legendado"].includes(value)
      )
    : DEFAULTS.audio;

  const selectedQualities = qualities.length
    ? qualities.join(",")
    : DEFAULTS.qualities.join(",");

  const selectedAudio = audio.length
    ? audio.join(",")
    : DEFAULTS.audio.join(",");

  const catalogList = CATALOGS.join(",");

  const base = ADDON_BASE_URL.replace(/\/+$/, "");

  return (
    `${base}/qualities=${selectedQualities}` +
    `%7Caudio=${selectedAudio}` +
    `%7Ccatalogs=${catalogList}` +
    `/manifest.json`
  );
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function buildPreview(data, actions = {}) {
  const section = createElement("section", "config-preview");
  section.setAttribute("aria-label", "Preview do Manifest");

  const header = createElement("div", "manifest-preview-header");

  const titleGroup = createElement("div", "manifest-title-group");
  titleGroup.append(
    createElement("span", "manifest-icon", "{ }"),
    createElement("div", "manifest-title-content")
  );

  const titleContent = titleGroup.querySelector(".manifest-title-content");
  titleContent.append(
    createElement("h3", "preview-title", "Preview do Manifest"),
    createElement("p", "preview-description", "Seu endereço de instalação será gerado automaticamente.")
  );

  const status = createElement("span", "manifest-status", "URL");
  header.append(titleGroup, status);

  const urlBox = createElement("div", "manifest-url-box");
  const url = buildManifestUrl(data);

  const urlText = createElement("code", "manifest-url", url);
  urlText.setAttribute("aria-label", "Endereço do Manifest");

  urlBox.append(urlText);

  const footer = createElement("div", "manifest-preview-footer");
  footer.append(
    createElement(
      "span",
      "manifest-footer-dot",
      "●"
    ),
    createElement(
      "p",
      "",
      "A URL acompanha automaticamente suas escolhas."
    )
  );

  const actionsContainer = createElement("div", "manifest-actions");

  const installButton = createElement(
    "button",
    "manifest-install-button",
    "Instalar no Stremio/Nuvio"
  );
  installButton.type = "button";

  const installIcon = createElement("span", "button-icon", "↗");
  installButton.prepend(installIcon);

  installButton.addEventListener("click", () => {
    if (typeof actions.onInstall === "function") {
      actions.onInstall(url);
    }
  });

  const copyButton = createElement(
    "button",
    "manifest-copy-button",
    "Copiar Manifest"
  );
  copyButton.type = "button";

  const copyIcon = createElement("span", "button-icon", "⧉");
  copyButton.prepend(copyIcon);

  copyButton.addEventListener("click", async () => {
    if (typeof actions.onCopy === "function") {
      await actions.onCopy(url);
    }
  });

  actionsContainer.append(installButton, copyButton);

  section.append(
    header,
    urlBox,
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
