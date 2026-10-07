// Shared production presentation for Home and the filmography.
const homeCredits = {
  'a-conspiracao-condor': 'Trailer oficial · Um filme de André Sturm',
  'ronaldinho-gaucho': 'Trailer oficial · Um documentário de Luis Ara',
  'cordialmente-teus': 'Trailer oficial · Um filme de Aimar Labaki'
};

const homeStreaming = {
  'a-conspiracao-condor': [
    ['Prime Video', 'https://www.primevideo.com/-/pt/detail/0MNXZRDWD0460YUIOM070CXCTL'],
    ['Apple TV', 'https://tv.apple.com/br/movie/a-conspiracao-condor/umc.cmc.syutknas1oc0k4mmuxc6xvux'],
    ['Claro TV+', 'https://www.clarotvmais.com.br/filme/a-conspiracao-condor/3592738']
  ],
  'ronaldinho-gaucho': [['Netflix', 'https://www.netflix.com/br/title/81731400']],
  'cordialmente-teus': [
    ['Apple TV', 'https://tv.apple.com/br/movie/cordialmente-teus/umc.cmc.4aohuxt2512mqyxnc5sc1lz6a'],
    ['Prime Video', 'https://www.primevideo.com/-/pt/detail/0NZR8VD2O596PIBWEZRHWEADU1'],
    ['Claro TV+', 'https://www.clarotvmais.com.br/filme/~/2529024']
  ]
};

function homeProduction(item) {
  const meta = `${item.type}${item.year ? ` · ${item.year}` : ''}`;
  const page = `${basePath}producoes/${item.slug}.html`;
  const videoId = item.trailer && new URL(item.trailer).searchParams.get('v');
  const media = videoId
    ? `<div class="production-screen home-trailer"><button class="trailer-cover" data-video-id="${videoId}" data-title="${item.title}" aria-label="Reproduzir trailer de ${item.title}"><span class="trailer-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span><span class="trailer-caption"><strong>${item.title}</strong><span>${homeCredits[item.slug] || 'Trailer oficial'}</span></span></button></div>`
    : `<a class="production-screen production-screen--image" href="${page}"><img src="${basePath}${item.cover}" alt="Capa de ${item.title}" loading="lazy"></a>`;
  return `<article class="home-production" aria-labelledby="title-${item.slug}">
    <header class="home-production__heading" data-reveal><${isHome ? 'h3' : 'h2'} class="home-production__title" id="title-${item.slug}">${item.title}</${isHome ? 'h3' : 'h2'}><p class="home-production__meta">${meta}</p></header>
    ${media}
    <div class="home-production__body" data-reveal><div>${item.genre ? `<p class="production-facts">Direção: ${item.director} · Gênero: ${item.genre}</p>` : ''}<p class="home-production__synopsis">${item.synopsis}</p><div class="production-feature__links"><a class="text-link" href="${page}">Conheça a produção <span>↗</span></a>${item.trailer ? `<a class="trailer-link" href="${item.trailer}" target="_blank" rel="noreferrer">Trailer no YouTube ↗</a>` : ''}</div></div><div class="home-streaming"><p class="home-streaming__label" id="streaming-${item.slug}">Assista nos streamings</p><ul aria-labelledby="streaming-${item.slug}">${(homeStreaming[item.slug] || []).map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${name} (abre em nova aba)">${name}</a></li>`).join('')}</ul></div></div>
  </article>`;
}

const homeCatalog = document.getElementById('featured-productions') || document.getElementById('catalog');
homeCatalog.innerHTML = productions.filter(item => !isHome || item.slug !== 'cordialmente-teus').map(homeProduction).join('');
homeCatalog.addEventListener('click', event => {
  const button = event.target.closest('[data-video-id]');
  if (!button) return;
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${button.dataset.videoId}?autoplay=1&playsinline=1&rel=0`;
  iframe.title = `Trailer de ${button.dataset.title}`;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  button.replaceWith(iframe);
  iframe.focus();
});

