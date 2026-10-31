
const NAVIGATION = [
  { label: "Início", href: "/" },
  { label: "Configurador", href: "/configure" }
];

export function Header() {
  const header = document.createElement("header");
  header.className = "site-header";
  header.setAttribute("role", "banner");

  const container = document.createElement("div");
  container.className = "header-container";

  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = "/";
  brand.setAttribute("aria-label", "BRTorrents — página inicial");

  const logo = document.createElement("img");
  logo.src = "/logo.svg";
  logo.alt = "";
  logo.width = 42;
  logo.height = 42;
  logo.decoding = "async";

  const brandName = document.createElement("span");
  brandName.className = "brand-name";
  brandName.textContent = "BRTorrents";

  brand.append(logo, brandName);

  const nav = document.createElement("nav");
  nav.className = "header-nav";
  nav.setAttribute("aria-label", "Navegação principal");

  for (const item of NAVIGATION) {
    const link = document.createElement("a");
    link.className = "nav-link";
    link.href = item.href;
    link.textContent = item.label;

    if (window.location.pathname === item.href) {
      link.setAttribute("aria-current", "page");
    }

    nav.append(link);
  }

  const action = document.createElement("a");
  action.className = "header-button";
  action.href = "/configure";
  action.textContent = "Configurar addon";

  container.append(brand, nav, action);
  header.append(container);

  return header;
        }
