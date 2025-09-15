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
   Menu hamburger (avec auto-injection du bouton si absent)
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  const BP = 800;

  // Trouve le nav container et le menu
  const navContainer = document.querySelector('.header .container.nav') || document.querySelector('.nav');
  const menu = document.getElementById('site-menu') || document.querySelector('.menu');
  if (!navContainer || !menu) return;

  // S'il n'y a PAS de bouton, on le crée et on l'insère avant le menu
  let btn = document.querySelector('.menu-toggle');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'menu-toggle';
    btn.setAttribute('aria-controls', 'site-menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Ouvrir le menu');
    btn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';

    // si le menu n'a pas d'id, on lui en met un
    if (!menu.id) menu.id = 'site-menu';

    // insère le bouton juste avant le menu
    navContainer.insertBefore(btn, menu);
  }

  const OPEN_CLASS = 'open';

  function isOpen(){ return menu.classList.contains(OPEN_CLASS); }
  function setAria(open){
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  function openMenu(){ menu.classList.add(OPEN_CLASS); setAria(true); }
  function closeMenu(){ menu.classList.remove(OPEN_CLASS); setAria(false); }

  // Toggle
  btn.addEventListener('click', () => { isOpen() ? closeMenu() : openMenu(); });

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

  // Resize: repasse en mode desktop proprement
  window.addEventListener('resize', () => {
    if (window.innerWidth > BP && isOpen()) closeMenu();
  });

  // État initial
  setAria(false);
});
