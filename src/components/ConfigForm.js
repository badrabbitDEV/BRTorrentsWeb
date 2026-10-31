
const QUALITIES = Object.freeze([
  { value: "4k", label: "4K", detail: "2160p" },
  { value: "1080p", label: "Full HD", detail: "1080p" },
  { value: "720p", label: "HD", detail: "720p" },
  { value: "sd", label: "SD", detail: "480p" }
]);

const AUDIO_OPTIONS = Object.freeze([
  { value: "dublado", label: "Dublado", detail: "Português do Brasil" },
  { value: "legendado", label: "Legendado", detail: "Áudio original" }
]);

const DEBRID_PROVIDERS = Object.freeze([
  { value: "none", label: "Nenhum", description: "Usar o sistema padrão" },
  { value: "realdebrid", label: "Real-Debrid", description: "Real-Debrid" },
  { value: "alldebrid", label: "AllDebrid", description: "AllDebrid" },
  { value: "premiumize", label: "Premiumize", description: "Premiumize" },
  { value: "torbox", label: "TorBox", description: "TorBox" }
]);

const DEFAULTS = Object.freeze({
  qualities: ["4k", "1080p", "720p", "sd"],
  audio: ["dublado", "legendado"],
  debrid: "none",
  apiKey: ""
});

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function createOption(option, groupName, checked) {
  const label = createElement("label", "config-option");
  const input = document.createElement("input");

  input.type = "checkbox";
  input.name = groupName;
  input.value = option.value;
  input.checked = checked;
  input.dataset.option = "true";

  const indicator = createElement("span", "option-indicator");
  indicator.setAttribute("aria-hidden", "true");

  const content = createElement("span", "option-content");
  const title = createElement("strong", "option-title", option.label);
  const detail = createElement("small", "option-detail", option.detail);

  content.append(title, detail);
  label.append(input, indicator, content);

  return label;
}

function collectFormData(form) {
  const qualities = Array.from(
    form.querySelectorAll('input[name="quality"]:checked')
  ).map(input => input.value);

  const audio = Array.from(
    form.querySelectorAll('input[name="audio"]:checked')
  ).map(input => input.value);

  const debrid = form.querySelector("#config-debrid").value;
  const apiKey = form.querySelector("#config-api-key").value.trim();

  if (qualities.length === 0) {
    throw new Error("Selecione pelo menos uma qualidade de vídeo.");
  }

  if (audio.length === 0) {
    throw new Error("Selecione pelo menos um tipo de áudio.");
  }

  if (!DEBRID_PROVIDERS.some(provider => provider.value === debrid)) {
    throw new Error("Selecione um provedor válido.");
  }

  if (debrid !== "none" && !apiKey) {
    throw new Error("Informe a API Key do provedor selecionado.");
  }

  return Object.freeze({
    qualities,
    audio,
    debrid,
    apiKey
  });
}

export function ConfigForm({ onChange = () => {} } = {}) {
  if (typeof onChange !== "function") {
    throw new TypeError("onChange precisa ser uma função.");
  }

  const form = document.createElement("form");
  form.className = "config-form";
  form.noValidate = true;
  form.autocomplete = "off";

  const header = createElement("div", "form-header");
  header.append(
    createElement("h2", "", "Personalize seu BRTorrents"),
    createElement("p", "", "Escolha como deseja encontrar e reproduzir seus conteúdos.")
  );

  const qualitySection = createElement("section", "config-section");
  qualitySection.append(
    createElement("h3", "config-section-title", "Qualidade de vídeo"),
    createElement("p", "config-section-description", "Selecione uma ou mais qualidades.")
  );

  const qualityGrid = createElement("div", "config-option-grid");

  QUALITIES.forEach(option => {
    qualityGrid.append(
      createOption(option, "quality", DEFAULTS.qualities.includes(option.value))
    );
  });

  qualitySection.append(qualityGrid);

  const audioSection = createElement("section", "config-section");
  audioSection.append(
    createElement("h3", "config-section-title", "Áudio"),
    createElement("p", "config-section-description", "Escolha os idiomas desejados.")
  );

  const audioGrid = createElement("div", "config-option-grid audio-grid");

  AUDIO_OPTIONS.forEach(option => {
    audioGrid.append(
      createOption(option, "audio", DEFAULTS.audio.includes(option.value))
    );
  });

  audioSection.append(audioGrid);

  const debridSection = createElement("section", "config-section");
  debridSection.append(
    createElement("h3", "config-section-title", "Provedor de Debrid"),
    createElement("p", "config-section-description", "Integração opcional com seu provedor.")
  );

  const providerGroup = createElement("div", "form-group");
  const providerLabel = createElement("label", "", "Selecione seu provedor");
  providerLabel.htmlFor = "config-debrid";

  const providerSelect = document.createElement("select");
  providerSelect.id = "config-debrid";
  providerSelect.name = "debrid";

  DEBRID_PROVIDERS.forEach(provider => {
    const option = document.createElement("option");
    option.value = provider.value;
    option.textContent = provider.label;
    providerSelect.append(option);
  });

  providerGroup.append(providerLabel, providerSelect);

  const apiGroup = createElement("div", "form-group api-key-group");
  apiGroup.hidden = true;

  const apiLabel = createElement("label", "", "API Key");
  apiLabel.htmlFor = "config-api-key";

  const apiInput = document.createElement("input");
  apiInput.id = "config-api-key";
  apiInput.name = "apiKey";
  apiInput.type = "password";
  apiInput.autocomplete = "off";
  apiInput.spellcheck = false;
  apiInput.placeholder = "Digite sua API Key...";

  const apiHint = createElement(
    "small",
    "api-key-hint",
    "Sua chave não será incluída na URL pública do Manifest."
  );

  const apiMessage = createElement("p", "api-key-message", "");

  apiGroup.append(apiLabel, apiInput, apiHint, apiMessage);
  debridSection.append(providerGroup, apiGroup);

  const status = createElement("p", "form-status", "");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  form.append(
    header,
    qualitySection,
    audioSection,
    debridSection,
    status
  );

  function updateProviderField() {
    const provider = providerSelect.value;
    const selected = DEBRID_PROVIDERS.find(item => item.value === provider);

    apiGroup.hidden = provider === "none";

    if (provider === "none") {
      apiInput.value = "";
      apiMessage.textContent = "";
    } else {
      apiMessage.textContent =
        `Coloque Sua API Key do ${selected.label} aqui.`;
    }
  }

  function notifyChange() {
    try {
      const data = collectFormData(form);
      status.textContent = "";
      status.dataset.state = "";
      onChange(data);
    } catch (error) {
      status.textContent = error.message;
      status.dataset.state = "error";

      const partial = {
        qualities: Array.from(
          form.querySelectorAll('input[name="quality"]:checked')
        ).map(input => input.value),
        audio: Array.from(
          form.querySelectorAll('input[name="audio"]:checked')
        ).map(input => input.value),
        debrid: providerSelect.value,
        apiKey: apiInput.value.trim()
      };

      onChange(partial);
    }
  }

  providerSelect.addEventListener("change", () => {
    updateProviderField();
    notifyChange();
  });

  form.addEventListener("input", notifyChange);
  form.addEventListener("change", notifyChange);

  updateProviderField();

  onChange({
    qualities: [...DEFAULTS.qualities],
    audio: [...DEFAULTS.audio],
    debrid: DEFAULTS.debrid,
    apiKey: ""
  });

  return form;
    }
