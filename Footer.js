
export function Footer() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.setAttribute("role", "contentinfo");

  const container = document.createElement("div");
  container.className = "footer-container";

  const brand = document.createElement("div");
  brand.className = "footer-brand";

  const logo = document.createElement("img");
  logo.src = "/logo.svg";
  logo.alt = "";
  logo.width = 32;
  logo.height = 32;
  logo.loading = "lazy";

  const name = document.createElement("strong");
  name.textContent = "BRTorrents";

  brand.append(logo, name);

  const description = document.createElement("p");
  description.className = "footer-description";
  description.textContent =
    "Seu configurador de addon, simples e personalizável.";

  const links = document.createElement("nav");
  links.className = "footer-links";
  links.setAttribute("aria-label", "Links do rodapé");

  const home = document.createElement("a");
  home.href = "/";
  home.textContent = "Início";

  const configure = document.createElement("a");
  configure.href = "/configure";
  configure.textContent = "Configurador";

  links.append(home, configure);

  const bottom = document.createElement("div");
  bottom.className = "footer-bottom";

  const copyright = document.createElement("span");
  copyright.textContent =
    `© ${new Date().getFullYear()} BRTorrents. Todos os direitos reservados.`;

  bottom.append(copyright);
  container.append(brand, description, links, bottom);
  footer.append(container);

  return footer;
}
