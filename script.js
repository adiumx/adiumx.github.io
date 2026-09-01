   // ===== HOME: animación secuencial del SVG (CESAR -> RUIZ -> FLORES) =====
    const ordenAnimacion = ['CESAR', 'RUIZ', 'FLORES'];
    const intervaloAnimacion = 500; // ms entre cada letra

    ordenAnimacion.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.style.animationPlayState = 'running';
        }, i * intervaloAnimacion);
      }
    });

    const container = document.getElementById('scrollContainer');
    const secciones = document.querySelectorAll('.pantalla');
    const total = secciones.length;

    let actual = 0;       // índice de la sección visible
    let animando = false; // evita que el scroll se dispare varias veces seguidas

    // Duración y curva de animación: ajusta estos valores a tu gusto
    const DURACION = 700; // milisegundos
    const EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';

    function irASeccion(indice) {
      if (indice < 0 || indice >= total || animando) return;

      animando = true;
      actual = indice;

      container.style.transition = `transform ${DURACION}ms ${EASING}`;
      container.style.transform = `translateY(-${actual * 100}dvh)`;

      setTimeout(() => {
        animando = false;
      }, DURACION);
    }

    // Navegación desde la navbar: intercepta los enlaces #home, #about_me, etc.
    document.querySelectorAll('.navbar a').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const destino = link.getAttribute('href').replace('#', '');
        const indice = Array.from(secciones).findIndex((s) => s.id === destino);
        if (indice !== -1) irASeccion(indice);
      });
    });

    // Rueda del mouse / trackpad
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        irASeccion(actual + 1);
      } else if (e.deltaY < 0) {
        irASeccion(actual - 1);
      }
    }, { passive: false });

    // Flechas del teclado (accesibilidad básica)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        irASeccion(actual + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        irASeccion(actual - 1);
      }
    });

    // ===== CONTACT: genera las filas con efecto marquee =====
    // Edita este arreglo para agregar, quitar o reordenar tus redes/contacto
    const contactItems = [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/cesar-ruiz-f/" },
      { label: "GitHub",   href: "https://github.com/adiumx" },
      { label: "Email",    href: "mailto:cesar.ruiz.f@gmail.com" }
    ];

    const list = document.getElementById('list');

    contactItems.forEach((item) => {
      const row = document.createElement('a');
      row.href = item.href;
      row.className = 'row';
      if (item.href.startsWith('http')) {
        row.target = '_blank';
        row.rel = 'noopener noreferrer';
      }

      const defaultLayer = document.createElement('div');
      defaultLayer.className = 'row-default';
      defaultLayer.innerHTML = `
        <div class="left">
          <span class="row-label">${item.label}</span>
        </div>
      `;

      const marqueeLayer = document.createElement('div');
      marqueeLayer.className = 'row-marquee';
      const track = document.createElement('div');
      track.className = 'marquee-track';

      const repeated = Array(10).fill(item.label);
      function buildWords() {
        const frag = document.createDocumentFragment();
        repeated.forEach((word) => {
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
    
    // ===== PROJECTS: vista previa flotante que sigue al mouse =====
    const cursorPreview = document.getElementById('cursor-preview');
    if (cursorPreview) {
      const cursorImg = cursorPreview.querySelector('img');
      const projectLinks = document.querySelectorAll('.project-link');

      document.addEventListener('mousemove', (e) => {
        cursorPreview.style.left = `${e.clientX}px`;
        cursorPreview.style.top = `${e.clientY}px`;
      });

      projectLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => {
          const imgSrc = link.getAttribute('data-img');
          cursorImg.src = imgSrc;
          cursorPreview.classList.add('is-visible');
        });

        link.addEventListener('mouseleave', () => {
          cursorPreview.classList.remove('is-visible');
        });
      });
    }

    // Swipe táctil básico (móvil)
    let touchStartY = 0;
    container.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diferencia = touchStartY - touchEndY;

      if (Math.abs(diferencia) > 50) { // umbral mínimo de swipe
        if (diferencia > 0) {
          irASeccion(actual + 1);
        } else {
          irASeccion(actual - 1);
        }
      }
    }, { passive: true });