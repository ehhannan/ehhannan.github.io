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

// --- Cartes cliquables publications ---
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.card[data-href]').forEach(card => {
    const url = card.getAttribute('data-href');
    if (!url) return;

    card.classList.add('is-clickable');
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0'); // navigation clavier

    function go(e) {
      // Si l'utilisateur ctrl/cmd-clic, ouvre en nouvel onglet
      const target = card.getAttribute('data-target') || (e && (e.metaKey || e.ctrlKey) ? '_blank' : '_self');
      window.open(url, target);
    }

    // Clic sur la carte (mais on laisse tranquilles les vrais boutons/links internes)
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button, input, textarea, select, summary')) return;
      go(e);
    });

    // Activation clavier (Enter ou Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go(e);
      }
    });
  });
});

// --- Cartes cliquables (avec protection sélection/drag/long-press) ---
document.addEventListener('DOMContentLoaded', function () {
  const CLICK_MOVE_TOL = 6;    // px
  const LONG_PRESS_MS  = 350;  // ms

  function hasSelection() {
    try { return (window.getSelection && window.getSelection().toString().trim().length > 0); }
    catch { return false; }
  }

  document.querySelectorAll('.card[data-href]').forEach(card => {
    if (card.dataset.clickableBound) return; // idempotent
    const url = card.getAttribute('data-href');
    if (!url) return;

    card.dataset.clickableBound = '1';
    card.classList.add('is-clickable');
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');

    let downX = 0, downY = 0, downT = 0;

    function go(e){
      const meta = (e && (e.metaKey || e.ctrlKey)) ? '_blank' : null;
      const target = card.getAttribute('data-target') || meta || '_self';
      window.open(url, target);
    }

    card.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button, input, textarea, select, summary, [contenteditable]')) return;
      downX = e.clientX; downY = e.clientY; downT = performance.now();
    });

    card.addEventListener('pointerup', (e) => {
      if (e.target.closest('a, button, input, textarea, select, summary, [contenteditable]')) return;
      const dx = Math.abs(e.clientX - downX);
      const dy = Math.abs(e.clientY - downY);
      const moved = (dx + dy) > CLICK_MOVE_TOL;
      const longPress = (performance.now() - downT) > LONG_PRESS_MS;
      if (hasSelection() || moved || longPress) return; // ne pas naviguer
      go(e);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (hasSelection()) return;
        go(e);
      }
    });
  });
});


