/* =========================================================
   Lien actif dans la navigation
   ========================================================= */
(function () {
  const raw = location.pathname.split('/').pop();
  const path = (raw && raw !== '/') ? raw.split('?')[0].split('#')[0] : 'index.html';

  document.querySelectorAll('.menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
    const isIndex = (path === 'index.html') && (href === '' || href === '/' || href === 'index.html');
    const match = href === path || isIndex;
    a.classList.toggle('active', match);
  });
})();

/* =========================================================
   UI initialisation
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  const BP = 880; // seuil mobile/tablette

  /* ---------------- Hamburger (+ animation X) ---------------- */
  const navContainer = document.querySelector('.header .container.nav') || document.querySelector('.nav');
  const menu = document.getElementById('site-menu') || document.querySelector('.menu');

  if (navContainer && menu) {
    // Crée le bouton si absent
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
    const isOpen = () => menu.classList.contains(OPEN_CLASS);
    const setAria = (open) => {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    const openMenu = () => { menu.classList.add(OPEN_CLASS); btn.classList.add('is-open'); setAria(true); };
    const closeMenu = () => { menu.classList.remove(OPEN_CLASS); btn.classList.remove('is-open'); setAria(false); };

    // Toggle
    btn.addEventListener('click', () => { isOpen() ? closeMenu() : openMenu(); });

    // Fermer après clic sur un lien
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { if (isOpen()) closeMenu(); }));

    // Clic extérieur
    document.addEventListener('click', (evt) => {
      if (!isOpen()) return;
      if (!menu.contains(evt.target) && !btn.contains(evt.target)) closeMenu();
    });

    // Escape
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' && isOpen()) { closeMenu(); btn.focus(); }
    });

    // Resize: repasse proprement en desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > BP && isOpen()) closeMenu();
    });

    setAria(false);
  }

  /* ---------------- Cartes cliquables (.card[data-href]) ----------------
     - Ne navigue PAS s’il y a sélection de texte, drag, ou long-press
     - Ctrl/Cmd-clic = nouvel onglet
  ---------------------------------------------------------------------- */
  (function () {
    const CLICK_MOVE_TOL = 6;    // px
    const LONG_PRESS_MS  = 350;  // ms

    const hasSelection = () => {
      try { return !!(window.getSelection && window.getSelection().toString().trim().length); }
      catch { return false; }
    };

    document.querySelectorAll('.card[data-href]').forEach(card => {
      if (card.dataset.clickableBound) return; // idempotent
      const url = card.getAttribute('data-href');
      if (!url) return;

      card.dataset.clickableBound = '1';
      card.classList.add('is-clickable');
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');

      let downX = 0, downY = 0, downT = 0;

      const go = (e) => {
        const meta = (e && (e.metaKey || e.ctrlKey)) ? '_blank' : null;
        const target = card.getAttribute('data-target') || meta || '_self';
        window.open(url, target);
      };

      // Pointer start
      card.addEventListener('pointerdown', (e) => {
        if (e.target.closest('a, button, input, textarea, select, summary, [contenteditable]')) return;
        downX = e.clientX; downY = e.clientY; downT = performance.now();
      });

      // Pointer end -> décider navigation
      card.addEventListener('pointerup', (e) => {
        if (e.target.closest('a, button, input, textarea, select, summary, [contenteditable]')) return;
        const dx = Math.abs(e.clientX - downX);
        const dy = Math.abs(e.clientY - downY);
        const moved = (dx + dy) > CLICK_MOVE_TOL;
        const longPress = (performance.now() - downT) > LONG_PRESS_MS;
        if (hasSelection() || moved || longPress) return; // ne pas naviguer
        go(e);
      });

      // Accessibilité clavier
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (hasSelection()) return;
          go(e);
        }
      });
    });
  })();

  /* ---------------- Bouton "remonter en haut" ---------------- */
  (function () {
    if (document.querySelector('.to-top')) return; // déjà injecté
    const btn = document.createElement('button');
    btn.className = 'to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Remonter en haut');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7.41 14.59 12 10l4.59 4.59 1.41-1.41L12 7.17 6 13.18z"/></svg>';
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
  })();

});
