// ====== НАСТРОЙКИ ======
const SETTINGS = {
  // WhatsApp номер (без + и пробелов)
  phone: "996500060100",

  // Текст сообщения
  message: "Здравствуйте! Спасибо за приглашение — мы обязательно придём!",

  // Дата свадьбы (+06:00 Бишкек)
  weddingDateTime: "2026-05-08T16:00:00+06:00",

  // Карта
  mapUrl: "https://go.2gis.com/IYwZq"
};

function buildWhatsAppLink(phone, text) {
  const encoded = encodeURIComponent(text);
  const cleanPhone = String(phone || "").replace(/[^\d]/g, "");
  if (cleanPhone.length >= 8) return `https://wa.me/${cleanPhone}?text=${encoded}`;
  return `https://wa.me/?text=${encoded}`;
}

function setCountdown(targetIso) {
  const target = new Date(targetIso).getTime();
  const $d = document.getElementById("cdDays");
  const $h = document.getElementById("cdHours");
  const $m = document.getElementById("cdMins");

  function tick() {
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const mins = Math.floor(diff / (1000 * 60));

    if ($d) $d.textContent = String(days);
    if ($h) $h.textContent = String(hours).padStart(2, "0");
    if ($m) $m.textContent = String(mins).padStart(2, "0");
  }

  tick();
  setInterval(tick, 1000 * 20);
}

function wireRSVP() {
  const link = buildWhatsAppLink(SETTINGS.phone, SETTINGS.message);
  const ids = ["rsvpTop", "rsvpHero", "rsvpInvite", "rsvpDetails", "rsvpBottom"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute("href", link);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noreferrer");
  });
}

function initHeroSlider() {
  const root = document.querySelector("[data-slider]");
  if (!root) return;

  const track = root.querySelector("[data-track]");
  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const prevBtn = root.querySelector("[data-prev]");
  const nextBtn = root.querySelector("[data-next]");
  const dotsWrap = root.querySelector("[data-dots]");

  if (!track || slides.length <= 1) return;

  let index = 0;

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hero-dot" + (i === index ? " is-active" : "");
      b.setAttribute("aria-label", `Фото ${i + 1}`);
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
    });
  }

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    renderDots();
  }

  prevBtn && prevBtn.addEventListener("click", () => go(index - 1));
  nextBtn && nextBtn.addEventListener("click", () => go(index + 1));

  let startX = 0;
  let dragging = false;

  root.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    dragging = true;
  }, { passive: true });

  root.addEventListener("touchend", (e) => {
    if (!dragging) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    dragging = false;

    if (Math.abs(dx) > 40) {
      if (dx < 0) go(index + 1);
      else go(index - 1);
    }
  }, { passive: true });

  go(0);
}

function init() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const mapLink = document.getElementById("mapLink");
  if (mapLink) mapLink.href = SETTINGS.mapUrl;

  wireRSVP();
  setCountdown(SETTINGS.weddingDateTime);
  initHeroSlider();
}

init();
