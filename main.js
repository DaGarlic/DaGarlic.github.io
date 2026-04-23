/* ── Scroll reveal ── */
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* Trigger hero reveals immediately */
document.querySelectorAll(".hero .reveal").forEach((el) => {
  setTimeout(() => el.classList.add("visible"), 80);
});

/* ── Mobile menu ── */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const menuOverlay = document.getElementById("menu-overlay");
const hamburgerIcon = document.getElementById("hamburger-icon");

const openPaths = "M6 18L18 6M6 6l12 12";
const closedPaths = "M4 6h16M4 12h16M4 18h16";

function toggleMenu() {
  const isOpen = !mobileMenu.classList.contains("hidden");
  if (isOpen) {
    mobileMenu.classList.add("hidden");
    hamburgerIcon.setAttribute("d", closedPaths);
  } else {
    mobileMenu.classList.remove("hidden");
    hamburgerIcon.setAttribute("d", openPaths);
  }
}

hamburger.addEventListener("click", toggleMenu);
menuOverlay.addEventListener("click", toggleMenu);

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    hamburgerIcon.setAttribute("d", closedPaths);
  });
});

/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id === "#") return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ── Hero canvas — animated geometric shapes ── */
(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function resize() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize();
  window.addEventListener("resize", resize);

  const W = () => canvas.offsetWidth;
  const H = () => canvas.offsetHeight;

  /* Palette */
  const palette = dark
    ? ["#3b5fc0", "#5b4fcf", "#2d6bbf", "#6b4fbf", "#3d8ccf"]
    : ["#93b4f5", "#b4a8f7", "#7ec8f5", "#c4a8f7", "#7ab8e8"];

  /* Shape types */
  const TYPES = ["circle", "triangle", "rect", "hexagon"];

  function randomShape() {
    return {
      x: Math.random() * W(),
      y: Math.random() * H(),
      r: 18 + Math.random() * 40,
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.18 + Math.random() * 0.22,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.008,
    };
  }

  const COUNT = 22;
  const shapes = Array.from({ length: COUNT }, randomShape);

  function drawHex(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
               : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath();
  }

  function drawTriangle(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const a = (Math.PI * 2 / 3) * i - Math.PI / 2;
      i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
               : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    ctx.closePath();
  }

  function tick() {
    const w = W(), h = H();
    ctx.clearRect(0, 0, w, h);

    shapes.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.vrot;

      if (s.x < -s.r * 2) s.x = w + s.r;
      if (s.x > w + s.r * 2) s.x = -s.r;
      if (s.y < -s.r * 2) s.y = h + s.r;
      if (s.y > h + s.r * 2) s.y = -s.r;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;

      switch (s.type) {
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, s.r, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "rect":
          ctx.fillRect(-s.r * 0.8, -s.r * 0.8, s.r * 1.6, s.r * 1.6);
          break;
        case "triangle":
          ctx.beginPath();
          for (let i = 0; i < 3; i++) {
            const a = (Math.PI * 2 / 3) * i - Math.PI / 2;
            i === 0 ? ctx.moveTo(s.r * Math.cos(a), s.r * Math.sin(a))
                     : ctx.lineTo(s.r * Math.cos(a), s.r * Math.sin(a));
          }
          ctx.closePath();
          ctx.fill();
          break;
        case "hexagon":
          drawHex(0, 0, s.r);
          ctx.fill();
          break;
      }
      ctx.restore();
    });

    requestAnimationFrame(tick);
  }

  tick();
})();
