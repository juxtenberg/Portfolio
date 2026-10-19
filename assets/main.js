(function () {
  // Loader
  window.addEventListener('load', function () { document.body.classList.add('loaded'); });
  setTimeout(function () { document.body.classList.add('loaded'); }, 2500);

  // Theme toggle
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) toggle.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Mobile menu
  var menuBtn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });

  // Reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('visible'); });
  }

  // Contact form -> email
  var form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var d = new FormData(form);
    var body = (d.get('message') || '') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')';
    location.href = 'mailto:jokenmuo@yahoo.com?subject=' + encodeURIComponent(d.get('subject')) +
      '&body=' + encodeURIComponent(body);
  });
})();
