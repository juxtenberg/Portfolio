(function () {
  var root = document.documentElement;
  var body = document.body;
  var base = body.getAttribute('data-base') || './';
  body.classList.remove('no-js');

  /* ---------- Loader ---------- */
  function done() { body.classList.add('loaded'); }
  if (document.readyState === 'complete') setTimeout(done, 250);
  else window.addEventListener('load', function () { setTimeout(done, 250); });
  setTimeout(done, 2500);

  /* ---------- Theme toggle ---------- */
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      document.querySelectorAll('.theme-toggle').forEach(function (b) {
        b.setAttribute('aria-label', next === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      });
    });
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    body.classList.toggle('no-scroll', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      var label = menuBtn.querySelector('.menu-btn__label');
      if (label) label.textContent = open ? 'Close' : 'Menu';
    }
    if (menu) menu.setAttribute('aria-hidden', String(!open));
    if (menu) menu.inert = !open;
  }
  if (menu) menu.inert = true;
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });
  }

  /* ---------- Search ---------- */
  var INDEX = [
    { t: 'Futina eStore', m: 'Case study · CRO, UI/UX', u: 'portfolio/futina-estore/', k: 'ecommerce mobile cro conversion electrical nigeria taxonomy trust hotjar vwo' },
    { t: 'MyData Assistant', m: 'Case study · App Design, UI/UX', u: 'portfolio/ai-mydata/', k: 'analytics ai dashboard design system saas chat settings notifications' },
    { t: 'Azany Seller Central', m: 'Case study · UI/UX', u: 'portfolio/azany-ecommerce/', k: 'marketplace seller dashboard ux audit design system ecommerce' },
    { t: 'SmSam Systems Website', m: 'Case study · UI/UX, Web Design', u: 'portfolio/smsam-revamp/', k: 'cybersecurity website redesign brand refresh' },
    { t: 'Moni by [AI]', m: 'Case study · UI/UX', u: 'portfolio/moni-case/', k: 'loyalty rewards mobile app landmark africa scanner' },
    { t: 'Works', m: 'Page', u: 'works/', k: 'projects portfolio selected works' },
    { t: 'About', m: 'Page', u: 'about/', k: 'experience skills tools resume cv story' },
    { t: 'Contact', m: 'Page', u: 'contact/', k: 'email phone dublin ireland hire talk form' },
    { t: 'Home', m: 'Page', u: '', k: 'designer innovation specialist services' }
  ];
  var search = document.getElementById('search');
  var input = search && search.querySelector('input');
  var results = search && search.querySelector('.search__results');
  var lastFocus = null;
  function render(q) {
    q = (q || '').trim().toLowerCase();
    var items = INDEX.filter(function (it) {
      if (!q) return it.m !== 'Page';
      return (it.t + ' ' + it.m + ' ' + it.k).toLowerCase().indexOf(q) !== -1;
    });
    results.innerHTML = items.length ? items.map(function (it) {
      return '<li><a href="' + base + it.u + '"><span class="r-title">' + it.t + '</span><span class="r-meta">' + it.m + '</span></a></li>';
    }).join('') : '<li class="search__empty">No matches for “' + q.replace(/[<>&"]/g, '') + '”.</li>';
  }
  function openSearch() {
    if (!search) return;
    lastFocus = document.activeElement;
    setMenu(false);
    search.classList.add('open');
    search.setAttribute('aria-hidden', 'false');
    search.inert = false;
    body.classList.add('no-scroll');
    render(input.value);
    setTimeout(function () { input.focus(); }, 50);
  }
  function closeSearch() {
    if (!search || !search.classList.contains('open')) return;
    search.classList.remove('open');
    search.setAttribute('aria-hidden', 'true');
    search.inert = true;
    body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }
  if (search) {
    search.inert = true;
    document.querySelectorAll('[data-open-search]').forEach(function (b) { b.addEventListener('click', openSearch); });
    search.querySelector('[data-close-search]').addEventListener('click', closeSearch);
    input.addEventListener('input', function () { render(input.value); });
    search.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var first = results.querySelector('a');
      if (first) location.href = first.href;
    });
    search.addEventListener('click', function (e) { if (e.target === search) closeSearch(); });
  }

  /* ---------- Lightbox for case-study images ---------- */
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image preview');
  lb.innerHTML = '<img alt=""><button class="icon-btn" type="button" aria-label="Close preview"><span class="material-icons" aria-hidden="true">close</span></button>';
  var zoomables = document.querySelectorAll('.zoomable');
  if (zoomables.length) {
    body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var closeLb = function () { lb.classList.remove('open'); body.classList.remove('no-scroll'); };
    zoomables.forEach(function (fig) {
      var img = fig.querySelector('img');
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');
      fig.setAttribute('aria-label', 'Enlarge image: ' + (img.alt || 'project image'));
      var open = function () { lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt; lb.classList.add('open'); body.classList.add('no-scroll'); lb.querySelector('button').focus(); };
      fig.addEventListener('click', open);
      fig.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    lb.addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSearch(); setMenu(false); }
    if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault(); openSearch();
    }
  });

  /* ---------- Problem tabs → jump to matching solution ---------- */
  document.querySelectorAll('[data-jump]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.getElementById(a.getAttribute('data-jump'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.remove('flash');
      void target.offsetWidth;
      target.classList.add('flash');
      setTimeout(function () { target.classList.remove('flash'); }, 1600);
      history.replaceState(null, '', '#' + target.id);
    });
  });

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(end) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = end; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  /* ---------- Reveal / skill bars / counters on scroll ---------- */
  var watched = document.querySelectorAll('.reveal, .bar span, [data-count], .story');
  function activate(el) {
    if (el.matches('.bar span')) el.style.width = el.getAttribute('data-w');
    else if (el.hasAttribute('data-count')) countUp(el);
    else el.classList.add('visible');
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { activate(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    watched.forEach(function (el) { io.observe(el); });
  } else {
    watched.forEach(activate);
  }

  /* ---------- Contact form → opens email app (static hosting) ---------- */
  var form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var note = form.querySelector('.form__note');
    var ok = true;
    ['name', 'email', 'subject'].forEach(function (n) {
      var f = form.elements[n];
      var bad = !f.value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) { note.textContent = 'Please fill in your name, a valid email and a subject.'; return; }
    var d = new FormData(form);
    var bodyText = (d.get('message') || '') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')';
    location.href = 'mailto:jokenmuo@yahoo.com?subject=' + encodeURIComponent(d.get('subject')) + '&body=' + encodeURIComponent(bodyText);
    note.textContent = 'Opening your email app with the message filled in…';
  });
})();
