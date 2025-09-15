// ----- Active nav link (plus robuste) -----
(function(){
  // Ex: "/index.html", "/", "/talks.html?x#y" -> "index.html" ou "talks.html"
  const raw = location.pathname.split('/').pop();
  const path = raw && raw !== '/' ? raw.split('?')[0].split('#')[0] : 'index.html';

  document.querySelectorAll('.menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
    if (href === path || (path === 'index.html' && (href === '' || href === 'index.html'))) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

// ----- Mobile hamburger -----
document.addEventListener('DOMContentLoaded', function () {
  const btn  = document.querySelector('.menu-toggle');
  const menu = document.getElementById('site-menu');
  if (!btn || !menu) return;

  function setIcon(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.innerHTML = open
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  }

  function closeMenu(){
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
      setIcon(false);
    }
  }

  // Toggle menu
  btn.addEventListener('click', function () {
    const open = menu.classList.toggle('open');
    setIcon(open);
  });

  // Fermer après clic sur un lien (ou son icône interne)
  menu.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (link) { closeMenu(); }
  });

  // Fermer si clic en dehors du menu et du bouton
  document.addEventListener('click', function(e){
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  });

  // Reset si on repasse en desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 720) { closeMenu(); }
  });

  // Escape pour fermer
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); }
  });
});
