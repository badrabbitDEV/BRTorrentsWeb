
import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";

const FEATURES = Object.freeze([
  {
    icon: "🎬",
    title: "Configuração personalizada",
    description:
      "Personalize idioma, qualidade e preferências do seu addon."
  },
  {
    icon: "⚙️",
    title: "Configuração simplificada",
    description:
      "Configure suas preferências em uma interface intuitiva e organizada."
  },
  {
    icon: "🔒",
    title: "Segurança em primeiro lugar",
    description:
      "Validação de dados, proteção de configurações e comunicação controlada com a API."
  },
  {
    icon: "📡",
    title: "Integração com o addon",
    description:
      "Prepare sua configuração para utilizar os recursos compatíveis do BRTorrents."
  }
]);

const QUALITY_OPTIONS = Object.freeze([
  "4K",
  "1080p",
  "720p",
  "480p"
]);

const NAVIGATION = Object.freeze({
  configure: "/configure"
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

function createLink(text, href, className = "") {
  const link = createElement("a", className, text);

  link.href = href;

  return link;
}

function createFeatureCard(feature) {
  const article = createElement("article", "feature-card");

  const icon = createElement(
    "span",
    "feature-icon",
    feature.icon
  );

  icon.setAttribute("aria-hidden", "true");

  const title = createElement(
    "h3",
    "feature-title",
    feature.title
  );

  const description = createElement(
    "p",
    "feature-description",
    feature.description
  );

  article.append(icon, title, description);

  return article;
}

function createQualityList() {
  const list = createElement("ul", "quality-list");

  for (const quality of QUALITY_OPTIONS) {
    const item = createElement(
      "li",
      "quality-item",
      quality
    );

    list.append(item);
  }

  return list;
}

function createHero() {
  const section = createElement("section", "hero-section");

  section.setAttribute("aria-labelledby", "hero-title");

  const content = createElement("div", "hero-content");

  const eyebrow = createElement(
    "span",
    "hero-eyebrow",
    "CONFIGURADOR OFICIAL"
  );

  const title = createElement(
    "h1",
    "hero-title",
    "Seu BRTorrents. Suas preferências."
  );

  title.id = "hero-title";

  const description = createElement(
    "p",
    "hero-description",
    "Configure suas preferências de idioma e qualidade em uma experiência simples, moderna e organizada."
  );

  const actions = createElement("div", "hero-actions");

  const primaryButton = createLink(
    "Começar configuração",
    NAVIGATION.configure,
    "button button-primary"
  );

  const secondaryButton = createLink(
    "Conhecer recursos",
    "#features",
    "button button-secondary"
  );

  actions.append(primaryButton, secondaryButton);

  content.append(
    eyebrow,
    title,
    description,
    actions
  );

  const visual = createElement("div", "hero-visual");

  visual.setAttribute("aria-hidden", "true");

  const visualCard = createElement("div", "hero-preview-card");

  const visualHeader = createElement(
    "div",
    "hero-preview-header",
    "BRTORRENTS"
  );

  const visualLabel = createElement(
    "span",
    "hero-preview-label",
    "QUALIDADE PREFERIDA"
  );

  const visualQuality = createElement(
    "strong",
    "hero-preview-quality",
    "1080p"
  );

  const visualFooter = createElement(
    "span",
    "hero-preview-footer",
    "Configuração personalizada"
  );

  visualCard.append(
    visualHeader,
    visualLabel,
    visualQuality,
    visualFooter
  );

  visual.append(visualCard);

  section.append(content, visual);

  return section;
}

function createFeatures() {
  const section = createElement("section", "features-section");

  section.id = "features";
  section.setAttribute("aria-labelledby", "features-title");

  const heading = createElement(
    "div",
    "section-heading"
  );

  const eyebrow = createElement(
    "span",
    "section-eyebrow",
    "RECURSOS"
  );

  const title = createElement(
    "h2",
    "section-title",
    "Tudo organizado em um só lugar"
  );

  title.id = "features-title";

  const description = createElement(
    "p",
    "section-description",
    "Uma experiência pensada para facilitar a configuração e o gerenciamento das suas preferências."
  );

  heading.append(eyebrow, title, description);

  const grid = createElement("div", "features-grid");

  for (const feature of FEATURES) {
    grid.append(createFeatureCard(feature));
  }

  section.append(heading, grid);

  return section;
}

function createQualitySection() {
  const section = createElement(
    "section",
    "quality-section"
  );

  section.setAttribute(
    "aria-labelledby",
    "quality-title"
  );

  const content = createElement(
    "div",
    "quality-content"
  );

  const eyebrow = createElement(
    "span",
    "section-eyebrow",
    "QUALIDADE"
  );

  const title = createElement(
    "h2",
    "section-title",
    "Escolha sua qualidade preferida"
  );

  title.id = "quality-title";

  const description = createElement(
    "p",
    "section-description",
    "O configurador disponibiliza quatro opções de qualidade. A disponibilidade real depende das fontes compatíveis."
  );

  content.append(eyebrow, title, description);

  const visual = createElement(
    "div",
    "quality-visual"
  );

  const listTitle = createElement(
    "h3",
    "quality-list-title",
    "Qualidades disponíveis"
  );

  visual.append(listTitle, createQualityList());

  section.append(content, visual);

  return section;
}

function createCallToAction() {
  const section = createElement(
    "section",
    "cta-section"
  );

  section.setAttribute(
    "aria-labelledby",
    "cta-title"
  );

  const title = createElement(
    "h2",
    "cta-title",
    "Pronto para configurar?"
  );

  title.id = "cta-title";

  const description = createElement(
    "p",
    "cta-description",
    "Personalize suas preferências e prepare sua configuração do BRTorrents."
  );

  const button = createLink(
    "Configurar agora",
    NAVIGATION.configure,
    "button button-primary"
  );

  section.append(title, description, button);

  return section;
}

function createMainContent() {
  const main = createElement("main", "home-main");

  main.id = "main-content";

  main.append(
    createHero(),
    createFeatures(),
    createQualitySection(),
    createCallToAction()
  );

  return main;
}

export function Home() {
  const page = createElement("div", "home-page");

  const skipLink = createLink(
    "Pular para o conteúdo",
    "#main-content",
    "skip-link"
  );

  const header = Header();
  const main = createMainContent();
  const footer = Footer();

  page.append(
    skipLink,
    header,
    main,
    footer
  );

  return page;
}

export default Home;
    
