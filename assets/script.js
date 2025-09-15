/* =========================================================
   Lien actif dans la navigation
   ========================================================= */
(function () {
  const raw = location.pathname.split('/').pop();
  const path = raw && raw !== '/' ? raw.split('?')[0].split('#')[0] : 'index.html';

  document.querySelectorAll('.menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
    const isIndex = (path === 'index.html') && (href === '' || href === 'index.html' || href === '/');
    const match = href === path || isIndex;
    a.classList.toggle('active', match);
  });
})();

/* =========================================================
   Menu hamburger (+ animation X)
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  const BP = 880;
  const navContainer = document.querySelector('.header .container.nav') || document.querySelector('.nav');
  const menu = document.getElementById('site-menu') || document.querySelector('.menu');
  if (!navContainer || !menu) return;

  // S'il n'y a pas de bouton, on le crée
  let btn = document.querySelector('.menu-toggle');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'menu-toggle';
    btn.setAttribute('aria-controls', 'site-menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Ouvrir le menu');
    btn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
    if (!menu.id) menu.id = 'site-menu';
    navContainer.insertBefore(btn, menu);
  }

  const OPEN_CLASS = 'open';

  function isOpen(){ return menu.classList.contains(OPEN_CLASS); }
  function setAria(open){
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  function openMenu(){
    menu.classList.add(OPEN_CLASS);
    btn.classList.add('is-open');   // active l’animation X
    setAria(true);
  }
  function closeMenu(){
    menu.classList.remove(OPEN_CLASS);
    btn.classList.remove('is-open'); // remet le hamburger
    setAria(false);
  }

  // Toggle
  btn.addEventListener('click', () => {
    isOpen() ? closeMenu() : openMenu();
  });

  // Ferme après clic sur un lien
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { if (isOpen()) closeMenu(); });
  });

  // Clic extérieur
  document.addEventListener('click', (evt) => {
    if (!isOpen()) return;
    const t = evt.target;
    if (!menu.contains(t) && !btn.contains(t)) closeMenu();
  });

  // Escape
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && isOpen()) { closeMenu(); btn.focus(); }
  });

  // Resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > BP && isOpen()) closeMenu();
  });

  // État initial
  setAria(false);
});

// --- Bouton "remonter en haut" ---
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.createElement('button');
  btn.className = 'to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Remonter en haut');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M7.41 14.59 12 10l4.59 4.59 1.41-1.41L12 7.17 6 13.18z"/>
    </svg>
  `;
  document.body.appendChild(btn);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onScroll = () => {
    if (window.scrollY > 300) btn.classList.add('show');
    else btn.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
});

