const basePath = location.pathname.includes('/pages/') || location.pathname.includes('/producoes/') ? '../' : '';
const logoPath = `${basePath}assets/brand/20250715_LEP_Filmes_FlatColors_Black.png`;

const isHome = document.body.classList.contains('home');

const navigation = [['index.html','nav.home'],['pages/producoes.html','nav.productions'],['pages/nossa-atuacao.html','nav.practice'],['pages/quem-somos.html','nav.about'],['pages/equipe.html','nav.team'],['pages/contato.html','nav.contact']];
function navMarkup() {
  const links = navigation.map(([path,key]) => `<a class="${key === 'nav.productions' ? 'nav-productions' : ''}" href="${LEP.url(basePath + path)}">${LEP.t(key)}</a>`).join('');
  return `<header class="site-header">
    <a class="wordmark" href="${LEP.url(basePath + 'index.html')}" aria-label="${LEP.t('nav.homeLabel')}"><img src="${logoPath}" alt="LEP Filmes"></a>
    <div class="header-controls">
      <button class="search-toggle" type="button" aria-label="${LEP.t('search.open')}" aria-expanded="false" aria-controls="site-search"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button>
      <nav class="language-switch" aria-label="${LEP.t('language')}"><a href="${LEP.url(location.href,'pt')}" lang="pt-BR" data-language="pt" ${LEP.lang === 'pt' ? 'aria-current="true"' : ''}>PT</a><span aria-hidden="true">|</span><a href="${LEP.url(location.href,'en')}" lang="en" data-language="en" ${LEP.lang === 'en' ? 'aria-current="true"' : ''}>EN</a></nav>
      <button class="menu-toggle" type="button" aria-label="${LEP.t('nav.open')}" aria-expanded="false" aria-controls="site-menu"><span></span><span></span><span></span></button>
    </div>
    <dialog class="menu-dialog" id="site-menu" aria-label="${LEP.t('nav.dialog')}">
      <div class="menu-dialog__top"><span class="menu-brand">LEP Filmes</span><button class="menu-close" aria-label="${LEP.t('nav.close')}" autofocus>${LEP.t('close')} <span aria-hidden="true">×</span></button></div>
      <nav class="site-nav" aria-label="${LEP.t('nav.label')}">${links}</nav>
    </dialog>
    <dialog class="search-dialog" id="site-search" aria-label="${LEP.t('search.open')}">
      <div class="search-dialog__top"><h2 class="display">${LEP.t('search.title')}</h2><button class="search-close" type="button" aria-label="${LEP.t('search.close')}">${LEP.t('close')} <span aria-hidden="true">×</span></button></div>
      <label class="search-label" for="production-search">${LEP.t('search.label')}</label><input id="production-search" type="search" placeholder="${LEP.t('search.placeholder')}" autocomplete="off" autofocus>
      <p class="search-status" aria-live="polite"></p><ul class="search-results"></ul>
    </dialog>
  </header>`;
}
function initSearch() {
  const dialog = document.getElementById('site-search');
  const toggle = document.querySelector('.search-toggle');
  const input = document.getElementById('production-search');
  const list = dialog.querySelector('.search-results');
  const status = dialog.querySelector('.search-status');
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
  const render = () => {
    const query = normalize(input.value);
    const results = productions.filter(item => [item.title, item.en?.title].filter(Boolean).some(title => normalize(title).includes(query)));
    list.replaceChildren();
    for (const original of results) {
      const item = localizedProduction(original);
      const li = document.createElement('li'), link = document.createElement('a'), title = document.createElement('span'), meta = document.createElement('small');
      link.href = LEP.url(basePath + 'producoes/' + item.slug + '.html');
      title.textContent = item.title; meta.textContent = item.type + ' · ' + item.year;
      link.append(title,meta); li.append(link); list.append(li);
    }
    status.textContent = !query ? LEP.t('search.hint') : results.length ? results.length + ' ' + LEP.t(results.length === 1 ? 'search.one' : 'search.count') : LEP.t('search.empty');
  };
  input.addEventListener('input', render);
  toggle.addEventListener('click', () => { render(); dialog.showModal(); document.body.classList.add('search-open'); toggle.setAttribute('aria-expanded','true'); input.focus(); });
  dialog.querySelector('.search-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.classList.remove('search-open'); toggle.setAttribute('aria-expanded','false'); });
  list.addEventListener('click', event => { if (event.target.closest('a')) dialog.close(); });
}
function footerMarkup() {
  const footerLogo = isHome ? `${basePath}assets/brand/20250715_LEP_Filmes_FlatColors_Black.png` : logoPath;
  return `<footer class="site-footer">
    <a class="wordmark wordmark--footer" href="${basePath}index.html" aria-label="${LEP.t('nav.homeLabel')}"><img src="${footerLogo}" alt="LEP Filmes"></a>
    <p>© ${isHome ? 2026 : new Date().getFullYear()} LEP Filmes</p>
    <a href="https://www.instagram.com/lepfilmes_/" target="_blank" rel="noreferrer">${isHome ? 'Instagram' : 'Instagram ↗'}</a>
  </footer>`;
}

function initIntro() {
  const intro = document.querySelector('#site-intro');
  if (!intro) return;
  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem('lep-intro-seen') === '1'; } catch (_) { /* Storage may be disabled. */ }
  if (alreadySeen || matchMedia('(prefers-reduced-motion: reduce)').matches) { intro.remove(); return; }
  const video = intro.querySelector('video');
  let finished = false;
  let watchdog;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(watchdog);
    try { sessionStorage.setItem('lep-intro-seen', '1'); } catch (_) { /* Keep navigation available. */ }
    video.pause();
    intro.classList.add('is-leaving');
    setTimeout(() => {
      intro.close();
      intro.remove();
      document.body.classList.remove('intro-open');
      video.removeAttribute('src');
      video.load();
    }, 450);
  };
  const armWatchdog = () => { if (finished) return; clearTimeout(watchdog); watchdog = setTimeout(finish, 6500); };
  intro.querySelector('.intro-skip').addEventListener('click', finish);
  intro.addEventListener('cancel', event => { event.preventDefault(); finish(); });
  video.addEventListener('ended', finish);
  video.addEventListener('error', finish);
  video.addEventListener('timeupdate', armWatchdog);
  video.addEventListener('playing', armWatchdog);
  document.body.classList.add('intro-open');
  intro.showModal();
  video.muted = true;
  video.src = video.dataset.src;
  armWatchdog();
  video.play().catch(finish);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('[data-header]').innerHTML = navMarkup();
  document.querySelector('[data-footer]').innerHTML = footerMarkup();
  const button = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-menu');
  const closeMenu = () => menu.close();
  menu.addEventListener('click', event => { if (event.target === menu) { const r = menu.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeMenu(); } });
  button.addEventListener('click', () => {
    menu.showModal();
    document.body.classList.add('menu-open');
    button.setAttribute('aria-expanded', 'true');
  });
  menu.querySelector('.menu-close').addEventListener('click', closeMenu);
  menu.addEventListener('close', () => {
    document.body.classList.remove('menu-open');
    button.setAttribute('aria-expanded', 'false');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  initSearch();
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a, .home-nav a').forEach(link => {
    if (new URL(link.href).pathname.endsWith(current)) link.setAttribute('aria-current', 'page');
  });
  // Also observe details rendered later in this DOMContentLoaded event.
  requestAnimationFrame(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll('[data-reveal]').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
  });
  if (!window.LEPIntroTest?.start()) initIntro();
});
