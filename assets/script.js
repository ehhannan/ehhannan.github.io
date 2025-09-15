// ----- Active nav link (robuste, sans hamburger) -----
(function () {
  // Exemple: "/index.html", "/", "/talks.html?x#y" -> "index.html" / "talks.html"
  const raw = location.pathname.split('/').pop();
  const path = raw && raw !== '/' ? raw.split('?')[0].split('#')[0] : 'index.html';

  document.querySelectorAll('.menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
    a.classList.toggle(
      'active',
      href === path || (path === 'index.html' && (href === '' || href === 'index.html'))
    );
  });
})();

// ----- Hamburger (ouvrir/fermer le menu sous 800px) -----
document.addEventListener('DOMContentLoaded', function () {
  const btn  = document.querySelector('.menu-toggle');
  const menu = document.getElementById('site-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Fermer après clic sur un lien (meilleure UX)
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Si on repasse au-dessus de 800px, on ferme le menu
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800 && menu.classList.contains('open')) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});

