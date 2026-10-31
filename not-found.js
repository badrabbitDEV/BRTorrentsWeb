
import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";

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

function createNotFoundContent() {
  const main = createElement("main", "not-found-main");
  main.id = "main-content";

  const container = createElement(
    "section",
    "not-found-container"
  );

  container.setAttribute("aria-labelledby", "not-found-title");

  const code = createElement(
    "span",
    "not-found-code",
    "404"
  );

  const icon = createElement(
    "div",
    "not-found-icon",
    "?"
  );

  icon.setAttribute("aria-hidden", "true");

  const eyebrow = createElement(
    "span",
    "not-found-eyebrow",
    "PÁGINA NÃO ENCONTRADA"
  );

  const title = createElement(
    "h1",
    "not-found-title",
    "Ops! Você se perdeu."
  );

  title.id = "not-found-title";

  const description = createElement(
    "p",
    "not-found-description",
    "A página que você está procurando não existe, foi movida ou está temporariamente indisponível."
  );

  const actions = createElement(
    "div",
    "not-found-actions"
  );

  const homeButton = createElement(
    "a",
    "button button-primary",
    "Voltar ao início"
  );

  homeButton.href = "/";

  const configureButton = createElement(
    "a",
    "button button-secondary",
    "Configurar addon"
  );

  configureButton.href = "/configure";

  actions.append(homeButton, configureButton);

  const help = createElement(
    "p",
    "not-found-help",
    "Confira o endereço digitado ou volte para uma das páginas disponíveis."
  );

  container.append(
    code,
    icon,
    eyebrow,
    title,
    description,
    actions,
    help
  );

  main.append(container);

  return main;
}

export function NotFound() {
  const page = createElement(
    "div",
    "not-found-page"
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
    createNotFoundContent(),
    Footer()
  );

  return page;
}

export default NotFound;
