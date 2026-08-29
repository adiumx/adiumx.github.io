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

//social rows
// Redes / contacto — edita este arreglo para agregar, quitar o reordenar
    const items = [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/cesar-ruiz-f/" },
      { label: "GitHub",   href: "https://github.com/adiumx" },
      { label: "Email",    href: "mailto:cesar.ruiz.f@gmail.com" }
    ];

    const list = document.getElementById('list');

    items.forEach((item, i) => {
      const row = document.createElement('a');
      row.href = item.href;
      row.className = 'row';
      if (item.href.startsWith('http')) {
        row.target = '_blank';
        row.rel = 'noopener noreferrer';
      }

      const index = String(i + 1).padStart(2, '0');

      // Contenido default (visible sin hover)
      const defaultLayer = document.createElement('div');
      defaultLayer.className = 'row-default';
      defaultLayer.innerHTML = `
        <div class="left">
        
          <span class="row-label">${item.label}</span>
        </div>
        
      `;

      // Capa marquee (se revela en hover, llena la fila con el nombre repetido)
      const marqueeLayer = document.createElement('div');
      marqueeLayer.className = 'row-marquee';
      const track = document.createElement('div');
      track.className = 'marquee-track';

      // Repetimos el nombre suficientes veces + set duplicado para loop infinito
      const repeated = Array(10).fill(item.label);
      function buildWords() {
        const frag = document.createDocumentFragment();
        repeated.forEach(word => {
          const span = document.createElement('span');
          span.className = 'marquee-word';
          span.innerHTML = `${word}<span class="dot"></span>`;
          frag.appendChild(span);
        });
        return frag;
      }
      track.appendChild(buildWords());
      track.appendChild(buildWords());
      marqueeLayer.appendChild(track);

      row.appendChild(marqueeLayer);
      row.appendChild(defaultLayer);
      list.appendChild(row);
    });

    // hover
    document.addEventListener('DOMContentLoaded', () => {
  const cursorPreview = document.getElementById('cursor-preview');
  const cursorImg = cursorPreview.querySelector('img');
  const projectLinks = document.querySelectorAll('.project-link');

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorPreview.style.left = `${mouseX}px`;
    cursorPreview.style.top = `${mouseY}px`;
  });

  projectLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const imgSrc = link.getAttribute('data-img');
      cursorImg.src = imgSrc;
      cursorPreview.classList.add('is-visible');
    });

    link.addEventListener('mouseleave', () => {
      cursorPreview.classList.remove('is-visible');
    });
  });
});