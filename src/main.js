
/* =========================================================
   BRTORRENTS — APPLICATION ENTRY POINT
   Version: 1.0.0
   Architecture: Vanilla JavaScript / ES Modules
   ========================================================= */

import "./styles/global.css";
import "./styles/components.css";

import { Home } from "./pages/home.js";
import { Configure } from "./pages/configure.js";
import { NotFound } from "./pages/not-found.js";

/* =========================================================
   01. CONFIGURAÇÕES
   ========================================================= */

const APP_CONFIG = Object.freeze({
  name: "BRTorrents",
  version: "1.0.0",
  rootSelector: "#app",
  defaultRoute: "/",
  configureRoute: "/configure",
  notFoundRoute: "/404"
});

const ROUTES = Object.freeze({
  "/": Home,
  "/configure": Configure
});

/* =========================================================
   02. UTILITÁRIOS
   ========================================================= */

function normalizePath(pathname) {
  if (typeof pathname !== "string") {
    return APP_CONFIG.defaultRoute;
  }

  let path = pathname.trim();

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  path = path.replace(/\/+/g, "/");

  if (path.length > 1) {
    path = path.replace(/\/+$/, "");
  }

  return path || APP_CONFIG.defaultRoute;
}

function getCurrentPath() {
  return normalizePath(window.location.pathname);
}

function createErrorElement(message) {
  const container = document.createElement("section");
  container.className = "app-error";
  container.setAttribute("role", "alert");

  const title = document.createElement("h1");
  title.textContent = "Não foi possível abrir esta página.";

  const description = document.createElement("p");
  description.textContent = message;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button-primary";
  button.textContent = "Tentar novamente";

  button.addEventListener("click", () => {
    window.location.reload();
  });

  container.append(title, description, button);

  return container;
}

/* =========================================================
   03. RESOLUÇÃO DE ROTAS
   ========================================================= */

function resolveRoute(path) {
  const normalizedPath = normalizePath(path);

  return ROUTES[normalizedPath] || NotFound;
}

/* =========================================================
   04. RENDERIZAÇÃO
   ========================================================= */

let appRoot = null;
let isRendering = false;

function renderPage(path = getCurrentPath()) {
  if (!appRoot || isRendering) {
    return;
  }

  isRendering = true;

  try {
    const normalizedPath = normalizePath(path);
    const PageComponent = resolveRoute(normalizedPath);

    let page;

    try {
      page = PageComponent();
    } catch {
      page = createErrorElement(
        "Ocorreu um erro inesperado durante a montagem da página."
      );
    }

    if (!(page instanceof Node)) {
      page = createErrorElement(
        "A página retornou um conteúdo inválido."
      );
    }

    appRoot.replaceChildren(page);

    document.title =
      normalizedPath === "/"
        ? `${APP_CONFIG.name} — Configurador`
        : normalizedPath === "/configure"
          ? `Configurar — ${APP_CONFIG.name}`
          : `Página não encontrada — ${APP_CONFIG.name}`;

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    updateNavigation(normalizedPath);
  } finally {
    isRendering = false;
  }
}

/* =========================================================
   05. NAVEGAÇÃO
   ========================================================= */

function navigate(path) {
  if (typeof path !== "string") {
    return;
  }

  const normalizedPath = normalizePath(path);

  if (
    !normalizedPath.startsWith("/") ||
    normalizedPath.startsWith("//")
  ) {
    return;
  }

  const currentPath = getCurrentPath();

  if (normalizedPath === currentPath) {
    return;
  }

  try {
    window.history.pushState(
      {},
      "",
      normalizedPath
    );

    renderPage(normalizedPath);
  } catch {
    window.location.assign(normalizedPath);
  }
}

function updateNavigation(currentPath) {
  const links = appRoot.querySelectorAll(
    'a[href="/"], a[href="/configure"]'
  );

  links.forEach((link) => {
    const linkPath = normalizePath(
      link.getAttribute("href")
    );

    if (linkPath === currentPath) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* =========================================================
   06. INTERCEPTAÇÃO DE LINKS INTERNOS
   ========================================================= */

function handleDocumentClick(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
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

  if (
    destination.origin !== window.location.origin ||
    destination.protocol !== "http:" &&
    destination.protocol !== "https:"
  ) {
    return;
  }

  if (
    destination.pathname !== "/" &&
    destination.pathname !== "/configure"
  ) {
    return;
  }

  if (
    destination.search ||
    destination.hash
  ) {
    return;
  }

  event.preventDefault();

  navigate(destination.pathname);
}

/* =========================================================
   07. HISTÓRICO DO NAVEGADOR
   ========================================================= */

function handlePopState() {
  renderPage(getCurrentPath());
}

/* =========================================================
   08. TRATAMENTO DE ERROS GLOBAIS
   ========================================================= */

function handleGlobalError(event) {
  if (!event.error) {
    return;
  }

  // Não exibe detalhes técnicos ou dados internos ao usuário.
  console.error(
    `[${APP_CONFIG.name}] Erro inesperado.`
  );
}

function handleUnhandledRejection() {
  console.error(
    `[${APP_CONFIG.name}] Uma operação assíncrona falhou.`
  );
}

/* =========================================================
   09. INICIALIZAÇÃO
   ========================================================= */

function initializeApp() {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof document === "undefined") {
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

  document.addEventListener(
    "click",
    handleDocumentClick
  );

  window.addEventListener(
    "popstate",
    handlePopState
  );

  window.addEventListener(
    "error",
    handleGlobalError
  );

  window.addEventListener(
    "unhandledrejection",
    handleUnhandledRejection
  );

  renderPage();

  document.documentElement.dataset.app =
    APP_CONFIG.name.toLowerCase();

  document.documentElement.dataset.version =
    APP_CONFIG.version;
}

/* =========================================================
   10. EXECUÇÃO
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
