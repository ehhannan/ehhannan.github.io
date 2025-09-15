/* =========================================================
   Lien actif dans la navigation
   - Robustifie pour /, /index.html, ?query, #hash, etc.
   ========================================================= */
(function () {
  // "/index.html", "/", "/talks.html?x#y" -> "index.html" / "talks.html"
  const raw = location.pathname.split('/').pop();
  const path = raw && raw !== '/' ? raw.split('?')[0].split('#')[0] : 'index.html';

  // Sélectionne tous les liens du menu (présents sur toutes les pages)
  document.querySelectorAll('.menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
    const isIndex = (path === 'index.html') && (href === '' || href === 'index.html' || href === '/');
    const match = href === path || isIndex;
    a.classList.toggle('active', match);
  });
})();

/* =========================================================
   Menu hamburger (< 800px)
   - Bouton .menu-toggle + menu #site-menu
   - Ferme sur clic d'un lien, clic extérieur, Escape, et resize > 800px
   - Met à jour aria-expanded / aria-label
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  const btn  = document.querySelector('.menu-toggle');
  const menu = document.getElementById('site-menu');
  if (!btn || !menu) return;

  const OPEN_CLASS = 'open';
  const BP = 800;

  function setAria(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }

  function isOpen() {
    return menu.classList.contains(OPEN_CLASS);
  }

  function openMenu() {
    menu.classList.add(OPEN_CLASS);
    setAria(true);
  }

  function closeMenu() {
    menu.classList.remove(OPEN_CLASS);
    setAria(false);
  }

  // Toggle au clic sur le bouton
  btn.addEventListener('click', () => {
    isOpen() ? closeMenu() : openMenu();
  });

  // Fermer après clic sur un lien (meilleure UX mobile)
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (isOpen()) closeMenu();
    });
  });

  // Fermer au clic extérieur
  document.addEventListener('click', (evt) => {
    if (!isOpen()) return;
    const target = evt.target;
    const clickedInsideMenu = menu.contains(target);
    const clickedButton = btn.contains(target);
    if (!clickedInsideMenu && !clickedButton) {
      closeMenu();
    }
  });

  // Fermer sur Escape
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && isOpen()) {
      closeMenu();
      btn.focus();
    }
  });

  // Fermer si on repasse > 800px
  window.addEventListener('resize', () => {
    if (window.innerWidth > BP && isOpen()) {
      closeMenu();
    }
  });

  // État initial aria
  setAria(false);
});
