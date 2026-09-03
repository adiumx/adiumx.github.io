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
document.querySelector('.navbar a[href="#home"]')?.classList.add('active');
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
  

  // Marca el link activo según la sección visible
  const idActual = secciones[indice].id;
  document.querySelectorAll('.navbar a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${idActual}`);
  });

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
  { label: "GitHub", href: "https://github.com/adiumx" },
  { label: "Email", href: "mailto:cesar.ruiz.f@gmail.com" }
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
// ===== Precarga de imágenes de proyectos =====
document.querySelectorAll('.project-link').forEach((link) => {
  const src = link.getAttribute('data-img');
  if (src) {
    const preload = new Image();
    preload.src = src;
  }
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

function actualizarAlturaNavbar() {
  const navbar = document.querySelector('.navbar');
  const altura = navbar.offsetHeight;
  document.documentElement.style.setProperty('--navbar-height', altura + 'px');
}

actualizarAlturaNavbar();
window.addEventListener('resize', actualizarAlturaNavbar);

// ===== MODO OSCURO =====
const TRADUCCIONES = {
  es: {
    nav_home: 'Inicio',
    nav_about: 'Sobre mí',
    nav_projects: 'Proyectos',
    nav_contact: 'Contacto',
    bio_title: 'Biografía',
    bio_text: 'Originario de Puebla y egresado de la BUAP en Ciencias de la Computación. Mi perfil combina el desarrollo web con un enfoque creativo en diseño de interfaces, aplicando retículas y principios visuales claros. Al mismo tiempo, me apasiona la inteligencia artificial: actualmente trabajo en un asistente de voz que detecta una palabra de activación y silencios para interactuar con modelos de lenguaje. Además de mi formación técnica, disfruto la música y el dibujo, que me inspiran a mantener un estilo funcional y estético en mis proyectos.',
    p1: 'Proyecto integrador',
    p2: 'Tecnologías: JavaScript, Fetch API. Usé la Fetch API para realizar solicitudes HTTP y obtener datos en formato JSON desde la API pública de Rick and Morty. Con ayuda de una IA generé el código base, lo adapté y aprendí a manejar promesas, errores y a mostrar resultados dinámicos en la interfaz.',
    p3: 'Juego de Tic Tac Toe con lógica de turnos, detección de victoria y diseño responsivo.',
    cv: 'Descargar CV',
    tema_oscuro: 'Oscuro',
    tema_claro: 'Claro',
    idioma: 'EN'
  },
  en: {
    nav_home: 'Home',
    nav_about: 'About Me',
    nav_projects: 'Projects',
    nav_contact: 'Contact',
    bio_title: 'Biography',
    bio_text: 'Born in Puebla and a Computer Science graduate from BUAP. My profile combines web development with a creative approach to interface design, applying grids and clear visual principles. At the same time, I am passionate about artificial intelligence: I am currently building a voice assistant that detects a wake word and silences in order to interact with language models. Beyond my technical background, I enjoy music and drawing, which inspire me to keep a functional and aesthetic style in my projects.',
    p1: 'Capstone project',
    p2: 'Tech: JavaScript, Fetch API. I used the Fetch API to make HTTP requests and get JSON data from the public Rick and Morty API. With help from an AI I generated the base code, adapted it, and learned to handle promises, errors and render dynamic results in the interface.',
    p3: 'Tic Tac Toe game with turn logic, win detection and responsive design.',
    cv: 'Download CV',
    tema_oscuro: 'Dark',
    tema_claro: 'Light',
    idioma: 'ES'
  }
};

const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');

let idioma = localStorage.getItem('portfolio-lang') || 'es';
let tema = localStorage.getItem('portfolio-theme') || 'light';

function aplicarTema() {
  document.body.classList.toggle('dark', tema === 'dark');
  if (themeToggle) {
    const t = TRADUCCIONES[idioma];
    themeToggle.textContent = tema === 'dark' ? t.tema_claro : t.tema_oscuro;
  }
}

function aplicarIdioma() {
  const t = TRADUCCIONES[idioma];
  document.documentElement.lang = idioma;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const clave = el.getAttribute('data-i18n');
    if (t[clave]) el.textContent = t[clave];
  });
  if (langToggle) langToggle.textContent = t.idioma;
  aplicarTema();
}

themeToggle?.addEventListener('click', () => {
  tema = tema === 'dark' ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', tema);
  aplicarTema();
});

langToggle?.addEventListener('click', () => {
  idioma = idioma === 'es' ? 'en' : 'es';
  localStorage.setItem('portfolio-lang', idioma);
  aplicarIdioma();
});

aplicarIdioma();
