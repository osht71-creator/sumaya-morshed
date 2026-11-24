// سنة التذييل
document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// قائمة الجوال
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

// الظهور التدريجي عند التمرير
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// إمالة ثلاثية الأبعاد تتبع المؤشر
document.querySelectorAll("[data-tilt]").forEach((el) => {
  const isGallery = el.classList.contains("gallery3d");
  const base = isGallery ? { x: 6, y: -18 } : { x: 0, y: 0 };
  const strength = isGallery ? 22 : 8;
  const target = isGallery ? el.parentElement : el;
  if (!isGallery) el.style.transform = "";

  target.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || reduceMotion) return;
    const r = target.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${base.x - py * strength}deg) rotateY(${base.y + px * strength}deg)`;
  });
  target.addEventListener("pointerleave", () => {
    el.style.transform = isGallery ? "" : "perspective(1000px) rotateX(0) rotateY(0)";
  });
});

// بطاقات المهارات: تنقلب باللمس على الجوال
document.querySelectorAll(".skill").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("flipped"));
});

// مكعب النسيج: يدور وحده، ويمكن سحبه
const cube = document.getElementById("cube");
const scene = cube.parentElement;
let rx = -20, ry = 30, dragging = false, lastX = 0, lastY = 0, idle = true;

function render() { cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; }
function spin() {
  if (idle && !reduceMotion) { ry += 0.25; render(); }
  requestAnimationFrame(spin);
}
spin();

scene.addEventListener("pointerdown", (e) => {
  dragging = true; idle = false; lastX = e.clientX; lastY = e.clientY;
  scene.setPointerCapture(e.pointerId);
});
scene.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  ry += (e.clientX - lastX) * 0.5;
  rx -= (e.clientY - lastY) * 0.5;
  rx = Math.max(-80, Math.min(80, rx));
  lastX = e.clientX; lastY = e.clientY;
  render();
});
const stop = () => { dragging = false; setTimeout(() => (idle = true), 1500); };
scene.addEventListener("pointerup", stop);
scene.addEventListener("pointercancel", stop);
