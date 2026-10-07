const basePath = location.pathname.includes('/pages/') || location.pathname.includes('/producoes/') ? '../' : '';
const logoPath = `${basePath}assets/brand/20250715_LEP_Filmes_FlatColors_${document.body.classList.contains('home') ? 'White' : 'Black'}.png`;

const isHome = document.body.classList.contains('home');

const navigation = [['index.html','Início'],['pages/quem-somos.html','Quem Somos'],['pages/nossa-atuacao.html','Nossa Atuação'],['pages/producoes.html','Produções'],['pages/equipe.html','Equipe'],['pages/contato.html','Contato']];
function navMarkup() {
  const links = navigation.map(([path,label]) => `<a href="${basePath}${path}">${label}</a>`).join('');
  return `<header class="site-header">
    <a class="wordmark" href="${basePath}index.html" aria-label="LEP Filmes, página inicial"><img src="${logoPath}" alt="LEP Filmes"></a>
    <nav class="home-nav" aria-label="Navegação principal">${links}</nav>
    <button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="site-menu"><span></span><span></span></button>
    <dialog class="menu-dialog" id="site-menu" aria-label="Menu principal">
      <div class="menu-dialog__top"><p class="eyebrow">LEP Filmes</p><button class="menu-close" aria-label="Fechar menu" autofocus>Fechar <span aria-hidden="true">×</span></button></div>
      <nav class="site-nav" aria-label="Navegação principal">${links}</nav>
    </dialog>
  </header>`;
}
function footerMarkup() {
  const footerLogo = isHome ? `${basePath}assets/brand/20250715_LEP_Filmes_FlatColors_Black.png` : logoPath;
  return `<footer class="site-footer">
    <a class="wordmark wordmark--footer" href="${basePath}index.html" aria-label="LEP Filmes, página inicial"><img src="${footerLogo}" alt="LEP Filmes"></a>
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
  const desktop = matchMedia('(min-width: 761px)');
  desktop.addEventListener('change', () => { if (desktop.matches && menu.open) closeMenu(); });
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
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a, .home-nav a').forEach(link => {
    if (link.getAttribute('href').endsWith(current)) link.setAttribute('aria-current', 'page');
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

function imagePath(path) { return basePath + path; }
function productionCard(item, featured = false, index = 0) {
  const page = `${basePath}producoes/${item.slug}.html`;
  const videoId = item.trailer && new URL(item.trailer).searchParams.get('v');
  const media = videoId
    ? `<div class="production-screen"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" title="Trailer de ${item.title}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
    : `<a class="production-screen production-screen--image" href="${page}"><img src="${imagePath(item.cover)}" alt="Capa de ${item.title}" loading="lazy"></a>`;
  return `<article class="production-feature ${featured ? 'production-feature--home' : ''}" data-reveal>
    <div class="production-feature__heading"><span class="production-index">${String(index + 1).padStart(2, '0')}</span><p class="eyebrow">${item.type}${item.year ? ` · ${item.year}` : ''}</p></div>
    ${media}
    <div class="production-feature__body"><h${featured ? '3' : '2'}>${item.title}</h${featured ? '3' : '2'}><div><p>${item.synopsis}</p><div class="production-feature__links"><a class="text-link" href="${page}">Conheça a produção <span>↗</span></a>${item.trailer ? `<a class="trailer-link" href="${item.trailer}" target="_blank" rel="noreferrer">Trailer no YouTube ↗</a>` : ''}</div></div></div>
  </article>`;
}
