const BASE = import.meta.env.BASE_URL || "/";

function appPath(path = "") {
  return `${BASE}${path.replace(/^\/+/, "")}`;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function createFooterLink(label, path) {
  const link = document.createElement("a");

  link.className = "footer-link";
  link.href = appPath(path);
  link.textContent = label;

  return link;
}

function injectFooterStyles() {
  if (document.getElementById("brtorrents-footer-styles")) return;

  const style = document.createElement("style");
  style.id = "brtorrents-footer-styles";

  style.textContent = `
    .site-footer {
      position: relative;
      overflow: hidden;
      margin-top: 90px;
      border-top: 1px solid rgba(52, 211, 153, .14);
      background:
        radial-gradient(
          ellipse at 50% 0%,
          rgba(16, 185, 129, .09),
          transparent 65%
        ),
        #070f0c;
      color: #9ca3af;
    }

    .site-footer::before {
      position: absolute;
      top: 0;
      left: 50%;
      width: min(700px, 80%);
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(52, 211, 153, .55),
        transparent
      );
      content: "";
      transform: translateX(-50%);
    }

    .footer-container {
      width: min(1180px, calc(100% - 40px));
      margin: 0 auto;
      padding: 52px 0 24px;
    }

    .footer-main {
      display: grid;
      grid-template-columns: minmax(220px, 1.5fr) 1fr 1fr;
      gap: 55px;
      padding-bottom: 42px;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 11px;
      margin-bottom: 17px;
      color: #ecfdf5;
      text-decoration: none;
      width: fit-content;
    }

    .footer-brand-logo {
      width: 42px;
      height: 42px;
      object-fit: contain;
      border: 1px solid rgba(52, 211, 153, .2);
      border-radius: 12px;
      background: rgba(16, 185, 129, .08);
    }

    .footer-brand-name {
      font-size: 18px;
      font-weight: 850;
      letter-spacing: -.6px;
    }

    .footer-description {
      max-width: 340px;
      margin: 0;
      color: #84918a;
      font-size: 13px;
      line-height: 1.8;
    }

    .footer-heading {
      margin: 5px 0 18px;
      color: #e5f5eb;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 13px;
    }

    .footer-link {
      color: #8d9b93;
      font-size: 13px;
      text-decoration: none;
      transition: color .2s ease, transform .2s ease;
    }

    .footer-link:hover {
      color: #6ee7b7;
      transform: translateX(3px);
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding-top: 22px;
      border-top: 1px solid rgba(148, 163, 184, .1);
    }

    .footer-copyright {
      margin: 0;
      color: #718078;
      font-size: 11px;
      line-height: 1.7;
    }

    .footer-version {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #829188;
      font-size: 11px;
    }

    .footer-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 10px rgba(52, 211, 153, .5);
    }

    .footer-disclaimer {
      margin: 25px 0 0;
      color: #66736b;
      font-size: 10px;
      line-height: 1.7;
    }

    .footer-link:focus-visible,
    .footer-brand:focus-visible {
      outline: 2px solid #6ee7b7;
      outline-offset: 4px;
      border-radius: 4px;
    }

    @media (max-width: 760px) {
      .site-footer {
        margin-top: 60px;
      }

      .footer-container {
        width: calc(100% - 32px);
        padding-top: 38px;
      }

      .footer-main {
        grid-template-columns: 1fr 1fr;
        gap: 35px 22px;
      }

      .footer-brand-column {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 440px) {
      .footer-main {
        grid-template-columns: 1fr;
        gap: 28px;
      }

      .footer-brand-column {
        grid-column: auto;
      }

      .footer-bottom {
        align-items: flex-start;
        flex-direction: column;
        gap: 12px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .site-footer *,
      .site-footer *::before,
      .site-footer *::after {
        transition-duration: .01ms !important;
        animation-duration: .01ms !important;
      }
    }
  `;

  document.head.append(style);
}

export function Footer() {
  injectFooterStyles();

  const footer = createElement("footer", "site-footer");
  footer.setAttribute("role", "contentinfo");

  const container = createElement("div", "footer-container");
  const main = createElement("div", "footer-main");

  // Coluna da marca
  const brandColumn = createElement(
    "section",
    "footer-brand-column"
  );

  const brand = document.createElement("a");
  brand.className = "footer-brand";
  brand.href = appPath("");
  brand.setAttribute("aria-label", "BRTorrents — página inicial");

  const logo = document.createElement("img");
  logo.className = "footer-brand-logo";
  logo.src = appPath("logo.svg");
  logo.alt = "";
  logo.width = 42;
  logo.height = 42;
  logo.loading = "lazy";
  logo.decoding = "async";

  const brandName = createElement(
    "span",
    "footer-brand-name",
    "BRTorrents"
  );

  brand.append(logo, brandName);

  const description = createElement(
    "p",
    "footer-description",
    "Um addon para melhorar seu catálogo de filmes e séries com uma experiência simples e moderna."
  );

  brandColumn.append(brand, description);

  // Coluna de navegação
  const navigationColumn = createElement("section");

  const navigationHeading = createElement(
    "h2",
    "footer-heading",
    "Navegação"
  );

  const navigationLinks = createElement("nav", "footer-links");
  navigationLinks.setAttribute("aria-label", "Links do rodapé");

  navigationLinks.append(
    createFooterLink("Página inicial", ""),
    createFooterLink("Configurador", "configure")
  );

  navigationColumn.append(
    navigationHeading,
    navigationLinks
  );

  // Coluna de informações
  const informationColumn = createElement("section");

  const informationHeading = createElement(
    "h2",
    "footer-heading",
    "Informações"
  );

  const informationLinks = createElement("div", "footer-links");

  const projectLink = document.createElement("a");
  projectLink.className = "footer-link";
  projectLink.href = "https://github.com/badrabbitDEV/BRTorrentsWeb";
  projectLink.target = "_blank";
  projectLink.rel = "noopener noreferrer";
  projectLink.textContent = "Código do projeto";

  informationLinks.append(projectLink);

  informationColumn.append(
    informationHeading,
    informationLinks
  );

  main.append(
    brandColumn,
    navigationColumn,
    informationColumn
  );

  // Barra inferior
  const bottom = createElement("div", "footer-bottom");

  const year = new Date().getFullYear();

  const copyright = createElement(
    "p",
    "footer-copyright",
    `© ${year} BRTorrents. Todos os direitos reservados.`
  );

  const version = createElement("div", "footer-version");

  const statusDot = createElement("span", "footer-status-dot");
  statusDot.setAttribute("aria-hidden", "true");

  const versionText = createElement(
    "span",
    "",
    "Interface web"
  );

  version.append(statusDot, versionText);
  bottom.append(copyright, version);

  const disclaimer = createElement(
    "p",
    "footer-disclaimer",
    "O Melhor Indexador de Torrents chega em breve! Previsao: 15/11/26."
  );

  container.append(main, bottom, disclaimer);
  footer.append(container);

  return footer;
}
