
import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { ConfigForm } from "../components/ConfigForm.js";
import {
  Preview,
  updatePreview
} from "../components/Preview.js";

const PAGE_DEFAULTS = Object.freeze({
  name: "",
  language: "pt-BR",
  quality: "1080p",
  subtitles: true,
  enabled: true
});

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined && text !== null) {
    element.textContent = String(text);
  }

  return element;
}

function createBreadcrumb() {
  const nav = createElement("nav", "configure-breadcrumb");

  nav.setAttribute("aria-label", "Navegação estrutural");

  const homeLink = createElement("a", "", "Início");
  homeLink.href = "/";

  const separator = createElement("span", "", "/");
  separator.setAttribute("aria-hidden", "true");

  const current = createElement(
    "span",
    "breadcrumb-current",
    "Configurar"
  );

  current.setAttribute("aria-current", "page");

  nav.append(homeLink, separator, current);

  return nav;
}

function createPageHeader() {
  const section = createElement(
    "section",
    "configure-heading"
  );

  const eyebrow = createElement(
    "span",
    "section-eyebrow",
    "BRTORRENTS CONFIGURATOR"
  );

  const title = createElement(
    "h1",
    "configure-title",
    "Configure seu addon"
  );

  const description = createElement(
    "p",
    "configure-description",
    "Personalize suas opções e prepare seu link de instalação."
  );

  section.append(eyebrow, title, description);

  return section;
}

function createPanel(title, description, content) {
  const panel = createElement("section", "configure-panel");

  const heading = createElement(
    "div",
    "configure-panel-heading"
  );

  const panelTitle = createElement("h2", "", title);

  const panelDescription = createElement(
    "p",
    "",
    description
  );

  heading.append(panelTitle, panelDescription);

  panel.append(heading, content);

  return panel;
}

function createInformation() {
  const box = createElement(
    "aside",
    "configure-information"
  );

  const icon = createElement("span", "information-icon", "ⓘ");

  icon.setAttribute("aria-hidden", "true");

  const text = createElement(
    "p",
    "information-text",
    "A disponibilidade das qualidades e idiomas depende das fontes compatíveis com o addon."
  );

  box.append(icon, text);

  return box;
}

function createConfigurationLayout() {
  const layout = createElement(
    "div",
    "configure-layout"
  );

  const formColumn = createElement(
    "div",
    "configure-form-column"
  );

  const previewColumn = createElement(
    "div",
    "configure-preview-column"
  );

  const previewHeading = createElement(
    "h2",
    "preview-column-title",
    "Prévia da configuração"
  );

  const previewDescription = createElement(
    "p",
    "preview-column-description",
    "Confira suas opções selecionadas."
  );

  const previewContainer = Preview(PAGE_DEFAULTS);

  previewColumn.append(
    previewHeading,
    previewDescription,
    previewContainer
  );

  const form = ConfigForm({
    onChange(data) {
      updatePreview(previewContainer, data);
    },

    async onSubmit() {
      throw new Error(
        "A conexão com o servidor ainda não foi configurada."
      );
    }
  });

  const formPanel = createPanel(
    "Suas configurações",
    "Escolha as opções desejadas.",
    form
  );

  formColumn.append(
    formPanel,
    createInformation()
  );

  layout.append(formColumn, previewColumn);

  return layout;
}

function createMain() {
  const main = createElement(
    "main",
    "configure-main"
  );

  main.id = "main-content";

  const container = createElement(
    "div",
    "configure-container"
  );

  container.append(
    createBreadcrumb(),
    createPageHeader(),
    createConfigurationLayout()
  );

  main.append(container);

  return main;
}

export function Configure() {
  const page = createElement(
    "div",
    "configure-page"
  );

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
