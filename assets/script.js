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
