const BASE = import.meta.env.BASE_URL || "/";

const appPath = (path = "") =>
  `${BASE}${path.replace(/^\/+/, "")}`;

const NAVIGATION = [
  {
    label: "Início",
    path: "",
    icon: "⌂"
  },
  {
    label: "Configurador",
    path: "configure",
    icon: "⚙"
  }
];

function getCurrentRoute() {
  const pathname = window.location.pathname;
  const normalizedBase = BASE.endsWith("/") ? BASE : `${BASE}/`;

  if (pathname.startsWith(normalizedBase)) {
    return pathname
      .slice(normalizedBase.length)
      .replace(/\/+$/, "");
  }

  return pathname.replace(/^\/+|\/+$/g, "");
}

function createIcon(symbol, className = "") {
  const icon = document.createElement("span");
  icon.className = `header-icon ${className}`.trim();
  icon.textContent = symbol;
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function createBrand() {
  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = appPath("");
  brand.setAttribute("aria-label", "BRTorrents — página inicial");

  const logoWrapper = document.createElement("span");
  logoWrapper.className = "brand-logo-wrapper";

  const logo = document.createElement("img");
  logo.className = "brand-logo";
  logo.src = appPath("logo.svg");
  logo.alt = "";
  logo.width = 42;
  logo.height = 42;
  logo.decoding = "async";

  logo.addEventListener("error", () => {
    logoWrapper.classList.add("logo-fallback");
    logo.style.display = "none";

    const fallback = document.createElement("span");
    fallback.className = "brand-fallback";
    fallback.textContent = "BR";
    fallback.setAttribute("aria-hidden", "true");

    logoWrapper.append(fallback);
  }, { once: true });

  logoWrapper.append(logo);

  const brandText = document.createElement("span");
  brandText.className = "brand-text";

  const brandName = document.createElement("strong");
  brandName.className = "brand-name";
  brandName.textContent = "BRTorrents";

  const brandSubtitle = document.createElement("small");
  brandSubtitle.className = "brand-subtitle";
  brandSubtitle.textContent = "STREAMING HUB";

  brandText.append(brandName, brandSubtitle);
  brand.append(logoWrapper, brandText);

  return brand;
}

function createNavigation(currentRoute) {
  const nav = document.createElement("nav");
  nav.className = "header-nav";
  nav.setAttribute("aria-label", "Navegação principal");

  const list = document.createElement("div");
  list.className = "nav-list";

  NAVIGATION.forEach((item) => {
    const link = document.createElement("a");
    link.className = "nav-link";
    link.href = appPath(item.path);

    const icon = createIcon(item.icon);

    const label = document.createElement("span");
    label.textContent = item.label;

    link.append(icon, label);

    if (currentRoute === item.path) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    list.append(link);
  });

  nav.append(list);
  return nav;
}

function createActionButton() {
  const action = document.createElement("a");
  action.className = "header-button";
  action.href = appPath("configure");

  const icon = createIcon("+");

  const label = document.createElement("span");
  label.textContent = "Configurar addon";

  action.append(icon, label);

  return action;
}

function createMobileMenuButton() {
  const button = document.createElement("button");
  button.className = "mobile-menu-button";
  button.type = "button";
  button.setAttribute("aria-label", "Abrir menu");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "brtorrents-navigation");

  const icon = document.createElement("span");
  icon.className = "mobile-menu-icon";
  icon.setAttribute("aria-hidden", "true");

  icon.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  button.append(icon);

  return button;
}

function addHeaderStyles() {
  if (document.getElementById("brtorrents-header-styles")) return;

  const style = document.createElement("style");
  style.id = "brtorrents-header-styles";

  style.textContent = `
    .site-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      width: 100%;
      background: rgba(7, 15, 12, .88);
      border-bottom: 1px solid rgba(52, 211, 153, .12);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      transition:
        background .25s ease,
        border-color .25s ease,
        box-shadow .25s ease;
    }

    .site-header.is-scrolled {
      background: rgba(5, 12, 9, .96);
      border-bottom-color: rgba(52, 211, 153, .2);
      box-shadow: 0 12px 35px rgba(0, 0, 0, .2);
    }

    .header-container {
      width: min(1180px, calc(100% - 40px));
      min-height: 78px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 28px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-width: max-content;
      color: #f0fdf4;
      text-decoration: none;
    }

    .brand-logo-wrapper {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      overflow: hidden;
      border: 1px solid rgba(52, 211, 153, .25);
      border-radius: 14px;
      background:
        linear-gradient(145deg, rgba(16, 185, 129, .2), rgba(5, 46, 32, .5));
      box-shadow: 0 0 25px rgba(16, 185, 129, .1);
    }

    .brand-logo {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .brand-fallback {
      color: #6ee7b7;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: -1px;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .brand-name {
      color: #f0fdf4;
      font-size: 19px;
      line-height: 1.1;
      font-weight: 800;
      letter-spacing: -.7px;
    }

    .brand-subtitle {
      color: #6ee7b7;
      font-size: 9px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .header-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .nav-list {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 5px;
      border: 1px solid rgba(148, 163, 184, .09);
      border-radius: 14px;
      background: rgba(255, 255, 255, .025);
    }

    .nav-link {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      padding: 11px 15px;
      border: 1px solid transparent;
      border-radius: 10px;
      color: #9ca3af;
      font-size: 13px;
      font-weight: 650;
      text-decoration: none;
      transition:
        color .2s ease,
        background .2s ease,
        border-color .2s ease,
        transform .2s ease;
    }

    .nav-link:hover {
      color: #ecfdf5;
      background: rgba(16, 185, 129, .08);
      transform: translateY(-1px);
    }

    .nav-link.active {
      color: #a7f3d0;
      border-color: rgba(52, 211, 153, .15);
      background: rgba(16, 185, 129, .12);
    }

    .nav-link.active::after {
      position: absolute;
      bottom: -6px;
      left: 50%;
      width: 16px;
      height: 2px;
      border-radius: 10px;
      background: #34d399;
      content: "";
      transform: translateX(-50%);
      box-shadow: 0 0 12px rgba(52, 211, 153, .7);
    }

    .header-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      line-height: 1;
    }

    .header-button {
      min-height: 43px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      padding: 0 17px;
      border: 1px solid rgba(110, 231, 183, .3);
      border-radius: 12px;
      background: linear-gradient(135deg, #10b981, #059669);
      box-shadow: 0 5px 20px rgba(16, 185, 129, .15);
      color: #022c22;
      font-size: 12px;
      font-weight: 850;
      text-decoration: none;
      white-space: nowrap;
      transition:
        transform .2s ease,
        box-shadow .2s ease,
        filter .2s ease;
    }

    .header-button:hover {
      filter: brightness(1.1);
      box-shadow: 0 8px 28px rgba(16, 185, 129, .28);
      transform: translateY(-2px);
    }

    .header-button:active {
      transform: translateY(0) scale(.98);
    }

    .mobile-menu-button {
      width: 43px;
      height: 43px;
      display: none;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(52, 211, 153, .2);
      border-radius: 12px;
      background: rgba(16, 185, 129, .08);
      color: #a7f3d0;
      cursor: pointer;
    }

    .mobile-menu-icon {
      width: 19px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .mobile-menu-icon span {
      width: 100%;
      height: 2px;
      display: block;
      border-radius: 5px;
      background: currentColor;
      transition: transform .2s ease, opacity .2s ease;
    }

    .mobile-menu-button[aria-expanded="true"] .mobile-menu-icon span:first-child {
      transform: translateY(7px) rotate(45deg);
    }

    .mobile-menu-button[aria-expanded="true"] .mobile-menu-icon span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-button[aria-expanded="true"] .mobile-menu-icon span:last-child {
      transform: translateY(-7px) rotate(-45deg);
    }

    .site-header a:focus-visible,
    .site-header button:focus-visible {
      outline: 2px solid #6ee7b7;
      outline-offset: 4px;
    }

    @media (max-width: 760px) {
      .header-container {
        width: calc(100% - 28px);
        min-height: 68px;
        gap: 12px;
      }

      .brand-logo-wrapper {
        width: 40px;
        height: 40px;
        border-radius: 12px;
      }

      .brand-name {
        font-size: 17px;
      }

      .brand-subtitle {
        font-size: 8px;
      }

      .mobile-menu-button {
        display: inline-flex;
        margin-left: auto;
      }

      .header-nav {
        position: absolute;
        top: calc(100% + 1px);
        left: 0;
        right: 0;
        display: none;
        padding: 12px 14px 16px;
        border-bottom: 1px solid rgba(52, 211, 153, .15);
        background: rgba(5, 12, 9, .98);
        box-shadow: 0 18px 30px rgba(0, 0, 0, .25);
      }

      .header-nav.mobile-open {
        display: block;
        animation: headerMenuIn .2s ease both;
      }

      .nav-list {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 5px;
        padding: 0;
        border: 0;
        background: transparent;
      }

      .nav-link {
        justify-content: flex-start;
        padding: 14px;
        font-size: 14px;
      }

      .nav-link.active::after {
        top: 50%;
        right: 12px;
        bottom: auto;
        left: auto;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        transform: translateY(-50%);
      }

      .header-button {
        min-height: 40px;
        padding: 0 12px;
        font-size: 11px;
      }

      .header-button .header-icon {
        display: none;
      }
    }

    @media (max-width: 420px) {
      .header-container {
        width: calc(100% - 22px);
      }

      .brand {
        gap: 8px;
      }

      .brand-logo-wrapper {
        width: 36px;
        height: 36px;
      }

      .brand-name {
        font-size: 15px;
      }

      .brand-subtitle {
        letter-spacing: 1.5px;
      }

      .header-button {
        min-height: 37px;
        padding: 0 9px;
        font-size: 10px;
      }

      .mobile-menu-button {
        width: 38px;
        height: 38px;
      }
    }

    @keyframes headerMenuIn {
      from {
        opacity: 0;
        transform: translateY(-7px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .site-header *,
      .site-header *::before,
      .site-header *::after {
        animation-duration: .01ms !important;
        transition-duration: .01ms !important;
      }
    }
  `;

  document.head.append(style);
}

export function Header() {
  addHeaderStyles();

  const header = document.createElement("header");
  header.className = "site-header";
  header.setAttribute("role", "banner");

  const container = document.createElement("div");
  container.className = "header-container";

  const brand = createBrand();
  const currentRoute = getCurrentRoute();
  const nav = createNavigation(currentRoute);
  nav.id = "brtorrents-navigation";

  const action = createActionButton();
  const menuButton = createMobileMenuButton();

  function closeMenu() {
    nav.classList.remove("mobile-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      nav.classList.add("mobile-open");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Fechar menu");
    }
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  container.append(brand, nav, action, menuButton);
  header.append(container);

  return header;
}
