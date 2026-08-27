document.addEventListener("DOMContentLoaded", () => {
  const orden = ["CESAR", "RUIZ", "FLORES"];
  const intervalo = 500; // 1 segundo entre cada animación

  orden.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.style.animationPlayState = "running";
      }, i * intervalo);
    } else {
      console.warn(`Elemento con id ${id} no encontrado`);
    }
  });
});
// scroll control
function initScrollSnap({
  selector = '.pantalla',
  duration = 1000,
  easing = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2),
  linkSelector = 'a[href^="#"]',
  wheelCooldown = 700 // ms mínimo entre saltos, evita ráfagas de trackpad
} = {}) {

  const sections = Array.from(document.querySelectorAll(selector));
  let offsets = [];
  let current = 0;
  let isScrolling = false;
  let lastWheelTime = 0;
  let touchStartY = 0;
  function cacheOffsets() {
    offsets = sections.map((s) => s.offsetTop);
  }
  cacheOffsets();

  function scrollToSection(index) {
    if (index < 0 || index >= sections.length || isScrolling) return;

    isScrolling = true;
    current = index;

    const start = window.pageYOffset;
    const target = offsets[index]; // ya no lee layout aquí
    const distance = target - start;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easing(progress);

      window.scrollTo(0, start + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        isScrolling = false;
      }
    }

    requestAnimationFrame(step);
  }
  function onTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd(e) {
    if (isScrolling) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) < 50) return; // umbral mínimo para considerarlo swipe intencional

    if (diff > 0) {
      scrollToSection(current + 1); // swipe hacia arriba = avanza
    } else {
      scrollToSection(current - 1); // swipe hacia abajo = retrocede
    }
  }
  function onWheel(e) {
    e.preventDefault();
    const now = performance.now();
    if (isScrolling || now - lastWheelTime < wheelCooldown) return;
    lastWheelTime = now;

    if (e.deltaY > 0) {
      scrollToSection(current + 1);
    } else {
      scrollToSection(current - 1);
    }
  }

  function onKeydown(e) {
    if (isScrolling) return;
    // evita interceptar flechas si el foco está en un input/textarea
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      scrollToSection(current + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      scrollToSection(current - 1);
    }
  }

  function onLinkClick(e) {
    const href = e.currentTarget.getAttribute('href');
    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    e.preventDefault();
    const index = sections.indexOf(targetEl);
    if (index !== -1) scrollToSection(index);
  }

  function onResize() {
    cacheOffsets();
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('resize', onResize);

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('resize', onResize);
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  const links = document.querySelectorAll(linkSelector);
  links.forEach((link) => link.addEventListener('click', onLinkClick));

  return {
    goTo: scrollToSection,
    next: () => scrollToSection(current + 1),
    prev: () => scrollToSection(current - 1),
    destroy: () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      links.forEach((link) => link.removeEventListener('click', onLinkClick));
    }
  };
}
document.addEventListener('DOMContentLoaded', () => {
  const scroller = initScrollSnap({
    selector: '.pantalla',
    duration: 900
  });
});