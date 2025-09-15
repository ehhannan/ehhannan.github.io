
// Mark active nav link based on current path
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    const href = a.getAttribute('href');
    if ((path === '' && href === 'index.html') || href === path) {
      a.classList.add('active');
    }
  });
})();

<script>
(function(){
  const btn  = document.querySelector('.menu-toggle');
  const menu = document.getElementById('site-menu');
  if(!btn || !menu) return;

  const setIcon = (open) => {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>'
                         : '<i class="fa-solid fa-bars"></i>';
  };

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    setIcon(open);
  });

  menu.addEventListener('click', (e) => {
    if(e.target.tagName === 'A'){ menu.classList.remove('open'); setIcon(false); }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720 && menu.classList.contains('open')){
      menu.classList.remove('open'); setIcon(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')){
      menu.classList.remove('open'); setIcon(false);
    }
  });
})();
</script>

