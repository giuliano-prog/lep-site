const basePath = location.pathname.includes('/pages/') || location.pathname.includes('/producoes/') ? '../' : '';

function navMarkup() {
  return `
    <header class="site-header">
      <a class="wordmark" href="${basePath}index.html" aria-label="LEP Filmes, página inicial"><span>LEP</span><i>FILMES</i></a>
      <button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false"><span></span><span></span></button>
      <nav class="site-nav" aria-label="Navegação principal">
        <a href="${basePath}index.html">Início</a>
        <a href="${basePath}pages/quem-somos.html">Quem somos</a>
        <a href="${basePath}pages/producoes.html">Produções</a>
        <a href="${basePath}pages/equipe.html">Equipe</a>
        <a href="${basePath}pages/contato.html">Contato</a>
      </nav>
    </header>`;
}

function footerMarkup() {
  return `
    <footer class="site-footer">
      <a class="wordmark wordmark--footer" href="${basePath}index.html"><span>LEP</span><i>FILMES</i></a>
      <p>© <span id="year"></span> LEP Filmes</p>
      <a href="https://www.instagram.com/lepfilmes_/" target="_blank" rel="noreferrer">Instagram ↗</a>
    </footer>`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('[data-header]').innerHTML = navMarkup();
  document.querySelector('[data-footer]').innerHTML = footerMarkup();
  document.getElementById('year').textContent = new Date().getFullYear();
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    button.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.site-nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('is-open')));
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(link => {
    if (link.getAttribute('href').endsWith(current)) link.classList.add('active');
  });
  document.querySelectorAll('[data-reveal]').forEach(el => new IntersectionObserver(([entry], observer) => {
    if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
  }, { threshold: .12 }).observe(el));
});

function imagePath(path) { return basePath + path; }
function productionCard(item, featured = false) {
  const page = `${basePath}producoes/${item.slug}.html`;
  return `<article class="production-card ${featured ? 'production-card--featured' : ''}" data-reveal>
    <a class="production-image" href="${page}"><img src="${imagePath(item.cover)}" alt="Capa de ${item.title}" loading="lazy"></a>
    <div class="production-card__body"><p class="eyebrow">${item.type}${item.year ? ` · ${item.year}` : ''}</p><h3>${item.title}</h3><p>${item.synopsis}</p><a class="text-link" href="${page}">Conheça a produção <span>↗</span></a></div>
  </article>`;
}
