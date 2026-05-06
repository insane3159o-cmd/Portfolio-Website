const typeSound = new Audio('type.mp3');
typeSound.volume = 1.0; // max volume for louder typewriter
const clickSound = new Audio('click.mp3');
clickSound.volume = 1.0;
/* ════════════════════════════════════════
   DETECTIVE DATABASE — script.js
════════════════════════════════════════ */

// ────────────────────────────────────────
// RETURN FROM CONTACT — save/restore scroll
// ────────────────────────────────────────
const RETURN_FLAG = 'returnFromContact';
const SCROLL_KEY  = 'scrollPosition';

function saveContactState() {
  sessionStorage.setItem(RETURN_FLAG, 'true');
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
}

function restoreContactState() {
  const returning = sessionStorage.getItem(RETURN_FLAG) === 'true';
  const savedY    = parseInt(sessionStorage.getItem(SCROLL_KEY) || '0', 10);

  if (returning) {
    sessionStorage.removeItem(RETURN_FLAG);
    sessionStorage.removeItem(SCROLL_KEY);
  }

  return { returning, savedY };
}

// Wire up contact links to save state before leaving
function initContactLinkSavers() {
  document.querySelectorAll('.contact-links a[href^="http"]').forEach(link => {
    link.addEventListener('click', () => {
      saveContactState();
    });
  });
}

// ────────────────────────────────────────
// BOOT SEQUENCE DATA
// Each entry: { text, cls (CSS class), delay (ms) }
// ────────────────────────────────────────
const bootLines = [
 
  { text: '▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░ 35%',    cls: 't-dim',    delay: 0     },
  { text: 'INITIALIZING SECURE TERMINAL...',  cls: 't-muted',  delay: 600   },
 
  { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 68%',    cls: 't-dim',    delay: 600  },
  { text: 'DECRYPTION KEY LOADED',            cls: 't-normal', delay: 600  },
 
  { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%',   cls: 't-bright', delay: 600  },
  { text: ' ',                                cls: 't-dim',    delay: 600  },
  { text: '╔══════════════════════════════════════════════╗', cls: 't-normal', delay: 600  },
  { text: '║   OPERATIVE DATABASE v4.2    ║', cls: 't-head',   delay: 600  },
  { text: '╚══════════════════════════════════════════════╝', cls: 't-normal', delay: 600  },
  { text: ' ',                                cls: 't-dim',    delay: 600  },
  { text: 'ACCESSING PORTFOLIO FILE #2024-77B...', cls: 't-muted',  delay: 600  },
  { text: ' ',                                cls: 't-dim',    delay: 600  },
  { text: 'SUBJECT ......... SOUMYA DEOPA',   cls: 't-bright', delay: 600  },
  { text: 'STATUS .......... AVAILABLE',       cls: 't-green',  delay: 600  },
  { text: 'CLEARANCE ....... LEVEL 2 — INTERMEDIATE', cls: 't-bright', delay: 600  },
  { text: ' ',                                cls: 't-dim',    delay: 600  },
  { text: 'LOADING PORTFOLIO...',              cls: 't-muted',  delay: 600  },
  { text: 'ACCESS GRANTED.',                  cls: 't-green',  delay: 600  },
];

// ────────────────────────────────────────
// DOM REFERENCES
// ────────────────────────────────────────
const linesContainer = document.getElementById('lines');
const cursorEl       = document.getElementById('cursor');
const bootEl         = document.getElementById('boot');
const mainEl         = document.getElementById('main');

let booting = true; // flag — false once boot is dismissed

// ────────────────────────────────────────
// HANDLE RETURNING FROM CONTACT LINKS
// Check immediately on load; if returning, skip boot & restore scroll
// ────────────────────────────────────────
const { returning: isReturning, savedY } = restoreContactState();

if (isReturning) {
  booting = false;
  bootEl.classList.add('hidden');
  mainEl.classList.add('visible');
  mainEl.classList.add('returning');
  cursorEl.style.display = 'none';
  initScrollAnimations();
  initParallax();
  initContactLinkSavers();

  // Restore scroll after layout settles; scroll event will update progress & ticker
  requestAnimationFrame(() => {
    window.scrollTo(0, savedY);
  });
}

// ────────────────────────────────────────
// TYPEWRITER: render each line after its delay
// ────────────────────────────────────────
 // adjust based on height

document.addEventListener('click', () => {
  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });

document.addEventListener('click', (e) => {

  // ❌ ignore typing screen clicks (optional)
  if (booting) return;

    const clickable = e.target.closest('a, button, .evidence-card');

if (!clickable) return;

  const sound = clickSound.cloneNode();
  sound.volume = 0.6;

  // slight variation (feels real)
  sound.playbackRate = 0.9 + Math.random() * 0.2;

  sound.play().catch(() => {});



});


const MAX_LINES = 16;
let currentLineIndex = 0;

function typeLines() {
  typeNextLine();
}

function typeNextLine() {
  if (!booting || currentLineIndex >= bootLines.length) {
    setTimeout(() => showMain());
    return;
  }

  const line = bootLines[currentLineIndex];

  setTimeout(() => {
    const el = document.createElement('div');
    el.className = `terminal-line active ${line.cls}`;
    linesContainer.appendChild(el);

    typeText(el, line.text, 0, () => {
      currentLineIndex++;

      // keep inside box (no scroll)
      while (linesContainer.children.length > MAX_LINES) {
        linesContainer.removeChild(linesContainer.firstChild);
      }

      typeNextLine();
    });

  }, line.delay);
}
document.addEventListener('click', () => {
  typeSound.play().then(() => {
    typeSound.pause();
    typeSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });

function typeText(element, text, index, callback) {
  if (!booting) return;

  if (index < text.length) {
    const char = text.charAt(index);

    // add character
    element.textContent += char;

    // 🔊 SOUND SYNC WITH CHARACTER
    if (char !== ' ' && index % 2 === 0) {
      const sound = typeSound.cloneNode();
      sound.volume = 1.0;

      // small variation = realistic typing
      sound.playbackRate = 0.95 + Math.random() * 0.1;

      sound.play().catch(() => {});
    }

    setTimeout(() => {
      typeText(element, text, index + 1, callback);
    }, 25); // typing speed

  } else {
    callback();
  }
}



// ────────────────────────────────────────
// SHOW MAIN: fade boot out, fade main in
// ────────────────────────────────────────
function showMain() {
  booting = false;
  bootEl.classList.add('hidden');
  mainEl.classList.add('visible');
  cursorEl.style.display = 'none';
  initScrollAnimations();
  initParallax();
}

// ────────────────────────────────────────
// SKIP BOOT (called from HTML onclick)
// ────────────────────────────────────────
function skipBoot() {
  booting = false;
  bootEl.classList.add('hidden');
  mainEl.classList.add('visible');
  cursorEl.style.display = 'none';
  initScrollAnimations();
  initParallax();
}

// ────────────────────────────────────────
// SCROLL PROGRESS BAR
// ────────────────────────────────────────
const scrollProgressBar = document.querySelector('.scroll-progress-bar');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgressBar) scrollProgressBar.style.width = progress + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ────────────────────────────────────────
// SCROLL ANIMATIONS — VARIANTS + GROUP STAGGER
// ────────────────────────────────────────
function initScrollAnimations() {
  const allAppears = document.querySelectorAll('.appear');

  // Build groups based on closest section/hero/contact container
  const groups = {};
  allAppears.forEach((el) => {
    const container =
      el.closest('section') ||
      el.closest('.hero') ||
      el.closest('.contact-section');
    const key = container ? container.id || container.className.split(' ')[0] : 'default';
    if (!groups[key]) groups[key] = [];
    groups[key].push(el);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        const container =
          el.closest('section') ||
          el.closest('.hero') ||
          el.closest('.contact-section');
        const key = container ? container.id || container.className.split(' ')[0] : 'default';
        const group = groups[key] || [el];
        const index = group.indexOf(el);

        const manualDelay = parseInt(el.dataset.delay, 10) || 0;
        const stagger = Math.min(index * 100, 500); // cap at 500 ms
        const totalDelay = stagger + manualDelay;

        setTimeout(() => {
          el.classList.add('in');

          // Trigger timeline draw-on when first timeline item appears
          const timeline = el.closest('.timeline');
          if (timeline && !timeline.classList.contains('drawn')) {
            timeline.classList.add('drawn');
          }
        }, totalDelay);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  allAppears.forEach((el) => observer.observe(el));
}

// ────────────────────────────────────────
// PARALLAX EFFECTS (orbs + hero)
// ────────────────────────────────────────
function initParallax() {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (orb1) orb1.style.transform = `translateY(${y * 0.15}px)`;
    if (orb2) orb2.style.transform = `translateY(${y * -0.1}px)`;
  }, { passive: true });
}

// ────────────────────────────────────────
// SMOOTH SCROLL for nav anchors
// ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ────────────────────────────────────────
// TICKER VISIBILITY — hide during hero, show on scroll
// ────────────────────────────────────────
const tickerWrap = document.querySelector('.ticker-wrap');
const heroSection = document.querySelector('.hero');

function updateTickerVisibility() {
  if (!tickerWrap || !heroSection) return;
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  // If hero is still visible at the top of viewport, hide ticker
  if (heroBottom > 0) {
    tickerWrap.classList.add('hidden');
  } else {
    tickerWrap.classList.remove('hidden');
  }
}

if (tickerWrap && heroSection) {
  // Run immediately on load
  updateTickerVisibility();
  // And on every scroll
  window.addEventListener('scroll', updateTickerVisibility, { passive: true });
}

// ────────────────────────────────────────
// KICK OFF
// ────────────────────────────────────────
let started = false;

// If NOT returning, set up contact-link savers immediately
if (!isReturning) {
  initContactLinkSavers();
}

document.addEventListener('click', () => {
  if (started) return;
  started = true;

  // 🔊 unlock audio first
  typeSound.play().then(() => {
    typeSound.pause();
    typeSound.currentTime = 0;

    // ✅ NOW start typing
    typeLines();

  }).catch(() => {
    // fallback (if audio fails)
    typeLines();
  });

}, { once: true });

// ────────────────────────────────────────
// IMAGE HELPER — generates consistent modal image markup
// ────────────────────────────────────────
function generateProjectImages(urls) {
  const imgs = urls.map(u => `<img src="${u}" class="modal-project-img" alt="">`).join('');
  return `<div style="display:flex;flex-direction:column;gap:12px;align-items:center;padding:16px;">${imgs}</div>`;
}

// ────────────────────────────────────────
// PROJECT DATA — each entry has id, file, status, title,
// tagline, overview, features[], meta[], and an SVG image fn
// ────────────────────────────────────────
const projects = {
  casetrack: {
    fileId: 'FILE #PRJ-001',
    status: 'DEPLOYED',
    statusColor: 'green',
    title: 'Visualizing tools and Storytelling',
    caseTag: 'Tunnel Book',
    overview: 'A Tunnel Book (also called a peek-a-boo book) is a type of handmade book that creates a 3D scene using multiple layers of paper. When you look through it from the front, it feels like youre looking into a tunnel—hence the name.',
    features: [
      'Creates a strong sense of depth and perspective',
      'Combines illustration + paper engineering',
      'Great for storytelling and visual narratives',
    ],
    meta: ['Paper', 'Cardboard', 'Glue', 'Scissors', 'Artistic vision'],
    imgLabel: 'EXHIBIT A — STORYTELLING',
    svg: generateProjectImages(['history.jpg', 'vts.jpeg', 'history.jpeg']),
  },

  signal: {
    fileId: 'FILE #PRJ-002',
    status: 'LIVE',
    statusColor: 'green',
    title: 'Elements of Design',
    caseTag: '',
    overview: 'The principles of design are the rules that help you organize visual elements (like line, color, shape, typography) in a way that looks good and communicates clearly. Think of them as the "how to arrange things" in your design.',
    features: [
      'Balance: Distributing visual weight evenly (symmetrical or asymmetrical)',
    ],
    meta: ['balance', 'contrast', 'emphasis', 'movement', 'pattern', 'rhythm', 'unity'],
    imgLabel: 'EXHIBIT A — EOD',
    svg: generateProjectImages(['eod.jpeg', 'eod.jpeg', 'eod.jpeg']),
  },

  archive: {
    fileId: 'FILE #PRJ-003',
    status: 'CLASSIFIED',
    statusColor: 'red',
    title: 'Sketching',
    overview: 'This sketch appears to be a traditional architectural structure, possibly inspired by a temple or heritage monument. It uses pencil shading and line work to show form, depth, and structure.',
    features: [
      'Strong use of perspective to create depth',
    ],
    meta: ['sketching', 'pencil shading', 'line work', 'architectural drawing', 'artistic technique'],
    imgLabel: 'EXHIBIT A — SKETCH',
    svg: generateProjectImages(['SKERTCH 1.jpg', 'SKERTCH 1.jpg', 'SKERTCH 1.jpg']),
  },

  pattern: {
    fileId: 'FILE #PRJ-004',
    status: 'IN PROGRESS',
    statusColor: 'gold',
    title: 'Typography',
    overview: 'This board presents a handcrafted typeface ("Typeface Monastery") where letterforms are inspired by architectural elements of monasteries—like domes, arches, pillars, and ornamental structures.',
    features: [
      'Typography',
      'Architecture',
      'Visual identity',
    ],
    meta: ['Typography', 'Letterforms', 'Architectural inspiration', 'Custom typeface design', 'Visual identity'],
    imgLabel: 'EXHIBIT A — TYPOGRAPHY',
    svg: generateProjectImages(['typo.jpeg', 'typo.jpeg', 'typo.jpeg']),
  },

  securecomm: {
    fileId: 'FILE #PRJ-005',
    status: 'ACTIVE',
    statusColor: 'green',
    title: 'Empathy in Design',
    overview: 'Empathy in design means understanding the user’s feelings, needs, and experiences before creating a solution. It’s about seeing the problem from the user’s perspective, not just your own. This project explores how empathic research leads to more meaningful and human-centered design outcomes.',
    features: [
      'User-centered research and observation methods',
      'Empathy maps and user persona development',
      'Understanding user pain points and motivations',
      'Designing solutions that resonate emotionally',
      'Building inclusive experiences for diverse users',
    ],
    meta: ['Empathy', 'User Research', 'Human-Centered Design', 'Observation', 'Personas'],
    imgLabel: 'EXHIBIT A — EMPATHY IN DESIGN',
    svg: generateProjectImages(['sketch.jpeg']),
  },

  gridmapper: {
    fileId: 'FILE #PRJ-006',
    status: 'CONFIRMED',
    statusColor: 'gold',
    title: 'Grid Mapper',
    tagline: 'D3.js · Mapbox GL · PostGIS · Node.js',
    caseTag: 'GEOSPATIAL VISUALISATION',
    overview: 'An interactive geospatial intelligence tool for visualising, clustering, and analysing incident data across geographic districts. Grid Mapper layers dynamic heatmaps, cluster markers, and time-series playback on top of a custom Mapbox GL base map — enabling analysts to identify patterns and hotspots that would be invisible in tabular data alone.',
    features: [
      'Real-time heatmap rendering with PostGIS spatial queries',
      'K-means cluster detection with automatic radius tuning',
      'Time-series playback of incident evolution over custom ranges',
      'District boundary overlays with drill-down capability',
      'CSV / GeoJSON export for external GIS toolchain integration',
    ],
    meta: ['D3.js', 'Mapbox GL', 'PostGIS', 'Node.js', 'Turf.js'],
    imgLabel: 'EXHIBIT A — DISTRICT MAP VIEW',
    svg: generateProjectImages(['tools.jpeg', 'tools.jpeg', 'tools.jpeg']),
  },

  // ════════════════════════════════════════
  // DIGITAL DESIGN TOOLS — ADD YOUR DATA BELOW
  // ════════════════════════════════════════
  finale: {
    fileId: 'FILE #PRJ-007',
    status: 'ACTIVE',
    statusColor: 'green',
    title: 'Digital Design Tools',
    tagline: 'Photoshop · Illustrator · Figma · Web',
    caseTag: 'PORTFOLIO PROJECT',
    overview: 'An exploration of modern digital design tools including software applications used to create visuals, interfaces, graphics, and interactive experiences. Essential for UI/UX design, graphic design, branding, and web development.',
    features: [
      'Proficiency in Adobe Photoshop and Illustrator',
      'Figma for UI/UX wireframing and prototyping',
      'HTML, CSS, and JavaScript for web development',
    ],
    meta: ['Photoshop', 'Illustrator', 'Figma', 'HTML', 'CSS', 'JavaScript'],
    imgLabel: 'EXHIBIT A — DIGITAL DESIGN TOOLS',
    svg: generateProjectImages(['ddt.jpeg', 'ddt1.jpeg', 'ddt2.jpeg']),
  },

  // ════════════════════════════════════════
  // BASICS OF UX — ADD YOUR DATA BELOW
  // ════════════════════════════════════════
  basicsux: {
    fileId: 'FILE #PRJ-008',
    status: 'ACTIVE',
    statusColor: 'green',
    title: 'Basics of UX and 6D',
    tagline: 'User Experience · 6D Process · Design Thinking',
    caseTag: 'UX DESIGN',
    overview: 'User Experience (UX) is about how a person feels when interacting with a product—a website, app, or system. Good UX makes things easy, useful, and enjoyable. The 6D process provides a structured framework for design thinking and problem-solving.',
    features: [
      'User-centered design principles and methodologies',
      'The 6D process: Define, Discover, Dream, Design, Deliver, and Debrief',
      'Creating intuitive and enjoyable user interactions',
    ],
    meta: ['UX', 'Design Thinking', '6D Process', 'User Research', 'Prototyping'],
    imgLabel: 'EXHIBIT A — BASICS OF UX AND 6D',
    svg: generateProjectImages(['6d.png', '6d1.png', '6d2.png']),
  },

  // ════════════════════════════════════════
  // FUNDAMENTALS OF USER RESEARCH
  // ════════════════════════════════════════
  sixd: {
    fileId: 'FILE #PRJ-009',
    status: 'ACTIVE',
    statusColor: 'green',
    title: 'Fundamentals of User Research',
    tagline: 'UX Research · User Interviews · Usability Testing',
    caseTag: 'USER RESEARCH',
    overview: 'User research is the foundation of UX—it helps you understand real users, their needs, behaviors, and problems before designing anything. Without it, you’re just guessing. This project covers the core methods and principles of conducting effective user research.',
    features: [
      'Qualitative and quantitative research methodologies',
      'User interviews, surveys, and persona creation',
      'Usability testing and heuristic evaluation',
      'Analyzing user behavior to inform design decisions',
      'Building empathy through real user insights',
    ],
    meta: ['User Research', 'UX', 'Interviews', 'Usability Testing', 'Personas'],
    imgLabel: 'EXHIBIT A — USER RESEARCH',
    svg: generateProjectImages(['ur.png', 'ur1.png', 'ur2.png']),
  },
};

// ────────────────────────────────────────
// MODAL LOGIC
// ────────────────────────────────────────
const modal        = document.getElementById('project-modal');
const modalBackdrop= document.getElementById('modal-backdrop');
const modalClose   = document.getElementById('modal-close');

function openModal(projectKey) {
  const data = projects[projectKey];
  if (!data) return;

  // Populate
  document.getElementById('modal-file-id').textContent  = data.fileId;
  const statusEl = document.getElementById('modal-status');
  statusEl.textContent = data.status;
  statusEl.style.color = data.statusColor === 'red' ? 'var(--red)'
    : data.statusColor === 'gold' ? 'var(--gold)' : 'var(--green)';
  statusEl.style.borderColor = data.statusColor === 'red' ? 'rgba(192,57,43,0.4)'
    : data.statusColor === 'gold' ? 'rgba(180,130,40,0.4)' : 'rgba(39,174,96,0.3)';

  document.getElementById('modal-img').innerHTML      = data.svg;
  document.getElementById('modal-img-label').textContent = data.imgLabel;
  document.getElementById('modal-case-tag').textContent  = data.caseTag;
  document.getElementById('modal-title').textContent     = data.title;
  document.getElementById('modal-tagline').textContent   = data.tagline;
  document.getElementById('modal-overview').textContent  = data.overview;

  const featList = document.getElementById('modal-features');
  featList.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

  const metaEl = document.getElementById('modal-meta');
  metaEl.innerHTML = data.meta.map(t => `<span class="modal-meta-tag">${t}</span>`).join('');

  // Open
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Wire up cards
document.querySelectorAll('.evidence-card[data-project]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.project));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.project); }
  });
});

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
