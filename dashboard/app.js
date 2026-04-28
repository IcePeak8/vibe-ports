const translations = {
  en: {
    pageTitle: "Vibe Ports",
    metaDescription: "Static local port dashboard for vibe coding and AI coding agents.",
    siteControlsLabel: "Site controls",
    homeLabel: "Vibe Ports home",
    languageSwitcherLabel: "Language switcher",
    heroTitle: "Local port map for vibe coding agents.",
    heroText:
      "A static dashboard generated from a JSON registry. Agents use portctl to reserve ports; humans use this page to see the local service map at a glance.",
    registryLabel: "Registry",
    entriesSuffix: "entries",
    loading: "Loading...",
    exported: "Exported",
    updated: "Updated",
    unknown: "unknown",
    metricEntries: "Entries",
    metricRanges: "Ranges",
    metricReserved: "Reserved",
    metricListening: "Listening",
    registryEyebrow: "Registry",
    portsTitle: "Ports",
    thPort: "Port",
    thStatus: "Status",
    thProject: "Project",
    thService: "Service",
    thType: "Type",
    thRuntime: "Runtime",
    thUrl: "URL",
    emptyPorts: "No ports registered yet.",
    rangesEyebrow: "Ranges",
    rangesTitle: "Allocation Rules",
    loadErrorTitle: "Unable to load ports.json",
    status: {
      assigned: "assigned",
      blocked: "blocked",
      preferred: "preferred",
      reserved: "reserved"
    },
    runtime: {
      listening: "listening",
      free: "free",
      "not-scanned": "not scanned",
      unknown: "unknown"
    },
    rangeLabels: {
      frontend: "Frontend Apps",
      api: "API / BFF",
      worker: "Workers",
      admin: "Admin / Docs",
      webhook: "Webhook Tests",
      experiment: "Experiments",
      database: "Local Datastores",
      "ai-gateway": "AI Gateways"
    },
    rangeDescriptions: {
      frontend: "Next.js, Vite, Astro, docs preview, and other browser apps.",
      api: "HTTP APIs, BFF services, local model adapters, and webhook receivers.",
      worker: "Queue workers, automation runners, crawlers, and background task UIs.",
      admin: "Dashboards, docs, inspector panels, and admin consoles.",
      webhook: "Local callback endpoints, tunnels, OAuth redirects, and integration tests.",
      experiment: "Disposable prototypes, demos, and temporary research apps.",
      database: "Postgres, Redis, vector stores, and datastore dashboards.",
      "ai-gateway": "Local AI gateway services and agent control planes."
    }
  },
  zh: {
    pageTitle: "Vibe Ports",
    metaDescription: "给 vibe coding 和 AI agent 使用的本地端口静态看板。",
    siteControlsLabel: "站点控制",
    homeLabel: "Vibe Ports 首页",
    languageSwitcherLabel: "语言切换",
    heroTitle: "给 vibe coding agent 用的本地端口地图。",
    heroText:
      "这是由 JSON registry 生成的静态看板。AI agent 用 portctl 发现和登记端口，人类用这个页面快速查看本机服务分布。",
    registryLabel: "注册表",
    entriesSuffix: "个条目",
    loading: "加载中...",
    exported: "导出于",
    updated: "更新于",
    unknown: "未知",
    metricEntries: "登记条目",
    metricRanges: "端口段",
    metricReserved: "保留端口",
    metricListening: "运行中",
    registryEyebrow: "注册表",
    portsTitle: "端口",
    thPort: "端口",
    thStatus: "状态",
    thProject: "项目",
    thService: "服务",
    thType: "类型",
    thRuntime: "运行状态",
    thUrl: "地址",
    emptyPorts: "还没有登记端口。",
    rangesEyebrow: "端口段",
    rangesTitle: "分配规则",
    loadErrorTitle: "无法加载 ports.json",
    status: {
      assigned: "已分配",
      blocked: "禁用",
      preferred: "推荐",
      reserved: "保留"
    },
    runtime: {
      listening: "监听中",
      free: "空闲",
      "not-scanned": "未扫描",
      unknown: "未知"
    },
    rangeLabels: {
      frontend: "前端应用",
      api: "API / BFF",
      worker: "后台任务",
      admin: "管理台 / 文档",
      webhook: "Webhook 测试",
      experiment: "实验项目",
      database: "本地数据服务",
      "ai-gateway": "AI 网关"
    },
    rangeDescriptions: {
      frontend: "Next.js、Vite、Astro、文档预览和其他浏览器应用。",
      api: "HTTP API、BFF、本地模型适配器和 webhook 接收服务。",
      worker: "队列 worker、自动化任务、爬虫和后台任务面板。",
      admin: "Dashboard、文档、Inspector 和管理控制台。",
      webhook: "本地回调、隧道、OAuth redirect 和集成测试。",
      experiment: "一次性原型、demo 和临时研究项目。",
      database: "Postgres、Redis、向量库和数据库面板。",
      "ai-gateway": "本地 AI gateway 和 agent 控制平面。"
    }
  }
};

let currentLanguage = detectLanguage();
let currentData = null;

function byId(id) {
  return document.getElementById(id);
}

function t(key) {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

function detectLanguage() {
  const stored = localStorage.getItem("vibe-ports-language");
  if (stored === "zh" || stored === "en") {
    return stored;
  }

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.some((language) => String(language).toLowerCase().startsWith("zh"))
    ? "zh"
    : "en";
}

function setLanguage(language) {
  currentLanguage = language === "zh" ? "zh" : "en";
  localStorage.setItem("vibe-ports-language", currentLanguage);
  applyStaticTranslations();
  if (currentData) {
    render(currentData);
  }
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("metaDescription"));
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nLabel));
  });
  byId("ports-empty").textContent = t("emptyPorts");
  byId("registry-updated").textContent = t("loading");
  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    const active = button.dataset.langButton === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function runtimeFor(port, data) {
  return (data.runtime || []).find((entry) => Number(entry.port) === Number(port));
}

function linkFor(entry) {
  if (!entry.url) {
    return "";
  }

  return `<a href="${entry.url}">${entry.url.replace(/^https?:\/\//, "")}</a>`;
}

function labelFrom(mapName, key, fallback) {
  const map = translations[currentLanguage][mapName] || translations.en[mapName] || {};
  return map[key] || fallback || key;
}

function render(data) {
  currentData = data;
  const entries = [...(data.entries || [])].sort((a, b) => Number(a.port) - Number(b.port));
  const ranges = data.ranges || [];
  const reserved = entries.filter((entry) => entry.status === "reserved").length;
  const listening = (data.runtime || []).filter((entry) => entry.runtime === "listening").length;

  byId("registry-count").textContent = `${entries.length} ${t("entriesSuffix")}`;
  byId("registry-updated").textContent = data.exportedAt
    ? `${t("exported")} ${new Date(data.exportedAt).toLocaleString(currentLanguage === "zh" ? "zh-CN" : "en")}`
    : `${t("updated")} ${data.updatedAt || t("unknown")}`;
  byId("metric-entries").textContent = String(entries.length);
  byId("metric-ranges").textContent = String(ranges.length);
  byId("metric-reserved").textContent = String(reserved);
  byId("metric-listening").textContent = String(listening);

  const body = byId("ports-body");
  body.innerHTML = entries
    .map((entry) => {
      const runtime = runtimeFor(entry.port, data);
      const runtimeKey = runtime?.runtime || "not-scanned";
      const runtimeLabel = labelFrom("runtime", runtimeKey, runtimeKey);
      const statusLabel = labelFrom("status", entry.status, entry.status);

      return `<tr>
        <td><code>${entry.port}</code></td>
        <td><span class="badge status-${entry.status}">${statusLabel}</span></td>
        <td>${entry.project || ""}</td>
        <td>${entry.service || ""}</td>
        <td>${entry.type || ""}</td>
        <td><span class="runtime-${runtimeKey}">${runtimeLabel}</span></td>
        <td>${linkFor(entry)}</td>
      </tr>`;
    })
    .join("");
  byId("ports-empty").hidden = entries.length > 0;

  byId("ranges").innerHTML = ranges
    .map((range) => {
      const label = labelFrom("rangeLabels", range.id, range.label);
      const description = labelFrom("rangeDescriptions", range.id, range.description);

      return `<article class="range-card">
        <div><strong>${label}</strong><code>${range.start}-${range.end}</code></div>
        <p>${description}</p>
      </article>`;
    })
    .join("");
}

function showLoadError(error) {
  document.body.insertAdjacentHTML(
    "beforeend",
    `<main class="shell"><section class="panel"><h2>${t("loadErrorTitle")}</h2><p class="empty">${error.message}</p></section></main>`
  );
}

applyStaticTranslations();
document.querySelectorAll("[data-lang-button]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.langButton));
});

fetch("./ports.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load ports.json (${response.status})`);
    }
    return response.json();
  })
  .then(render)
  .catch(showLoadError);
