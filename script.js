// Substitua pelo número comercial oficial, com DDI e DDD, somente números.
const WHATSAPP_NUMBER = "5553999999999";

const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const routeLinks = [...document.querySelectorAll(".route-link")];
const views = [...document.querySelectorAll("[data-view]")];

const routes = new Map([
  ["/", { view: "home", target: "inicio" }],
  ["/solucoes", { view: "home", target: "solucoes" }],
  ["/produto", { view: "home", target: "produto" }],
  ["/resultados", { view: "home", target: "resultados" }],
  ["/planos", { view: "plans", target: "planos" }],
  ["/contato", { view: "home", target: "contato" }],
]);

function currentRoute() {
  const value = decodeURIComponent(window.location.hash.slice(1));
  return routes.has(value) ? value : "/";
}

function closeMenu() {
  body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 16);
  header.classList.toggle("plans-header", currentRoute() === "/planos");
}

function revealVisibleElements() {
  document.querySelectorAll(".reveal:not(.visible)").forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) element.classList.add("visible");
  });
}

function renderRoute({ smooth = true } = {}) {
  const route = currentRoute();
  const config = routes.get(route);

  views.forEach((view) => {
    view.hidden = view.dataset.view !== config.view;
  });

  routeLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${route}`;
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  closeMenu();
  updateHeader();

  requestAnimationFrame(() => {
    document.getElementById(config.target)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    revealVisibleElements();
  });
}

menuToggle.addEventListener("click", () => {
  const open = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === window.location.hash) {
      event.preventDefault();
      renderRoute();
    }
  });
});

window.addEventListener("hashchange", () => renderRoute());
window.addEventListener("scroll", updateHeader, { passive: true });

if (!window.location.hash) window.history.replaceState(null, "", "#/");

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  const message = link.dataset.message || "Olá! Quero conhecer a Monky Garage.";
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const tabButtons = [...document.querySelectorAll(".tab-button")];
const tabPanels = [...document.querySelectorAll(".tab-panel")];

function selectTab(name) {
  tabButtons.forEach((button) => {
    const active = button.dataset.tab === name;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  tabPanels.forEach((panel) => {
    const active = panel.dataset.panel === name;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });
}

tabButtons.forEach((button) => button.addEventListener("click", () => selectTab(button.dataset.tab)));
document.querySelectorAll("[data-feature]").forEach((button) => {
  button.addEventListener("click", () => {
    selectTab(button.dataset.feature);
    window.location.hash = "/solucoes";
  });
});

const modal = document.querySelector(".demo-modal");
document.querySelectorAll(".demo-trigger").forEach((trigger) => trigger.addEventListener("click", () => modal.showModal()));
document.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => { if (event.target === modal) modal.close(); });

document.querySelectorAll(".plan-details").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".plan-card");
    const open = card.classList.toggle("details-open");
    button.setAttribute("aria-expanded", String(open));
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelector("#year").textContent = new Date().getFullYear();
updateHeader();
renderRoute({ smooth: false });
