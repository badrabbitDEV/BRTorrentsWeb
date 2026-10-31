
import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { ConfigForm } from "../components/ConfigForm.js";
import {
  Preview,
  updatePreview,
  buildManifestUrl,
  ADDON_BASE_URL
} from "../components/Preview.js";

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function createBreadcrumb() {
  const nav = createElement("nav", "configure-breadcrumb");
  nav.setAttribute("aria-label", "Navegação estrutural");

  const home = createElement("a", "", "Início");
  home.href = "/";

  const separator = createElement("span", "", "/");
  separator.setAttribute("aria-hidden", "true");

  const current = createElement("span", "breadcrumb-current", "Configurar");
  current.setAttribute("aria-current", "page");

  nav.append(home, separator, current);

  return nav;
}

function createPageHeader() {
  const section = createElement("section", "configure-heading");

  section.append(
    createElement("span", "section-eyebrow", "BRTORRENTS CONFIGURATOR"),
    createElement("h1", "configure-title", "Configure seu addon"),
    createElement(
      "p",
      "configure-description",
      "Personalize suas preferências e gere seu Manifest de instalação."
    )
  );

  return section;
}

function createPanel(title, description, content) {
  const panel = createElement("section", "configure-panel");
  const heading = createElement("div", "configure-panel-heading");

  heading.append(
    createElement("h2", "", title),
    createElement("p", "", description)
  );

  panel.append(heading, content);
  return panel;
}

function createInformation() {
  const box = createElement("aside", "configure-information");

  box.append(
    createElement("span", "information-icon", "ⓘ"),
    createElement(
      "p",
      "information-text",
      "As opções disponíveis dependem das fontes e integrações suportadas pelo servidor do BRTorrents."
    )
  );

  return box;
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const temporary = document.createElement("textarea");
  temporary.value = value;
  temporary.setAttribute("readonly", "");
  temporary.style.position = "fixed";
  temporary.style.opacity = "0";

  document.body.append(temporary);
  temporary.select();

  const copied = document.execCommand("copy");
  temporary.remove();

  if (!copied) {
    throw new Error("Não foi possível copiar. Copie o endereço manualmente.");
  }
}

function createConfigurationLayout() {
  const layout = createElement("div", "configure-layout");

  const formColumn = createElement("div", "configure-form-column");
  const previewColumn = createElement("div", "configure-preview-column");

  const previewHeading = createElement(
    "div",
    "preview-column-heading"
  );

  previewHeading.append(
    createElement("span", "section-eyebrow", "INSTALLATION"),
    createElement("h2", "preview-column-title", "Seu Manifest"),
    createElement(
      "p",
      "preview-column-description",
      "Confira o endereço gerado antes de instalar."
    )
  );

  let currentData = {
    qualities: ["4k", "1080p", "720p", "sd"],
    audio: ["dublado", "legendado"],
    debrid: "none",
    apiKey: ""
  };

  const actions = {
    onInstall(url) {
      if (ADDON_BASE_URL.includes("SEU-DOMINIO-DO-ADDON")) {
        window.alert("Configure primeiro o domínio real do addon em Preview.js.");
        return;
      }

      const stremioUrl = `stremio://${url.replace(/^https?:\/\//, "")}`;
      window.location.href = stremioUrl;
    },

    async onCopy(url) {
      if (ADDON_BASE_URL.includes("SEU-DOMINIO-DO-ADDON")) {
        window.alert("Configure primeiro o domínio real do addon em Preview.js.");
        return;
      }

      try {
        await copyText(url);
        window.alert("Manifest copiado com sucesso!");
      } catch (error) {
        window.alert(error.message);
      }
    }
  };

  let preview = Preview(currentData, actions);

  const form = ConfigForm({
    onChange(data) {
      currentData = data;

      const nextPreview = updatePreview(
        preview,
        currentData,
        actions
      );

      preview = nextPreview;
    }
  });

  const formPanel = createPanel(
    "Suas configurações",
    "Escolha as opções desejadas para seu addon.",
    form
  );

  formColumn.append(
    formPanel,
    createInformation()
  );

  previewColumn.append(
    previewHeading,
    preview
  );

  layout.append(formColumn, previewColumn);

  return layout;
}

function createMain() {
  const main = createElement("main", "configure-main");
  main.id = "main-content";

  const container = createElement("div", "configure-container");

  container.append(
    createBreadcrumb(),
    createPageHeader(),
    createConfigurationLayout()
  );

  main.append(container);
  return main;
}

export function Configure() {
  const page = createElement("div", "configure-page");

  const skipLink = createElement(
    "a",
    "skip-link",
    "Pular para o conteúdo"
  );

  skipLink.href = "#main-content";

  page.append(
    skipLink,
    Header(),
    createMain(),
    Footer()
  );

  return page;
}

export default Configure;
