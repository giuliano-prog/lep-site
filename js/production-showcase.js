// Reusable views share catalogue, platform links and on-demand playback.
const homeCatalog = document.getElementById('featured-productions') || document.getElementById('catalog');
function streamingMarkup(item, logos = false) {
  return `<div class="home-streaming"><p class="home-streaming__label" id="streaming-${item.slug}">${LEP.t('production.watch')}</p><ul aria-labelledby="streaming-${item.slug}">${(item.streaming || []).map(([id,url]) => {
    const platform = streamingPlatforms[id];
    return `<li><a class="${logos ? 'streaming-logo' : ''}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${platform.name} (${LEP.t('newTab')})" title="${platform.name}">${logos ? `<img src="${basePath}${platform.logo}" alt="${platform.name}" loading="lazy">` : platform.name}</a></li>`;
  }).join('')}</ul></div>`;
}
function productionMarkup(original) {
  const item = localizedProduction(original);
  const page = LEP.url(basePath + 'producoes/' + item.slug + '.html');
  const play = `<span class="trailer-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>`;
  if (isHome) return `<article class="home-production film-feature" aria-label="${item.title}">
    <div class="production-screen home-trailer film-media"><button type="button" class="trailer-cover" data-production="${item.slug}" aria-label="${LEP.t('production.play')} ${item.title}"><img class="film-still" src="${basePath}${item.trailerImage}" alt="" loading="lazy">${play}</button><div class="film-overlay"><h2>${item.title}</h2><p>${item.director}</p></div></div>
    <div class="film-meta">${LEP.text(item.homeCategory)} • ${item.year}</div>
    <div class="home-production__body"><div><p class="home-production__synopsis">${item.synopsis}</p><a class="text-link" href="${page}">${LEP.t('production.more')} <span aria-hidden="true">↗</span></a></div>${streamingMarkup(item,true)}</div>
  </article>`;
  const credit = item.slug === 'ronaldinho-gaucho' ? LEP.t('production.docBy') : item.slug === 'abre-a-coxia' ? LEP.t('production.seriesBy') : LEP.t('production.filmBy');
  return `<article class="home-production" aria-label="${item.title}"><header class="home-production__heading" data-reveal><h2 class="home-production__title">${item.title}</h2><p class="home-production__meta">${item.type} · ${item.year}</p></header>
    <div class="production-screen home-trailer"><button type="button" class="trailer-cover" data-production="${item.slug}" aria-label="${LEP.t('production.play')} ${item.title}">${play}<span class="trailer-caption"><strong>${item.title}</strong><span>${LEP.t('production.official')} · ${credit} ${item.director}</span></span></button></div>
    <div class="home-production__body" data-reveal><div>${item.genre ? `<p class="production-facts">${LEP.t('production.director')}: ${item.director} · ${LEP.t('production.genre')}: ${item.genre}</p>` : ''}<p class="home-production__synopsis">${item.synopsis}</p><div class="production-feature__links"><a class="text-link" href="${page}">${LEP.t('production.more')} <span>↗</span></a><a class="trailer-link" href="${item.trailer}" target="_blank" rel="noreferrer">${LEP.t(item.trailer.includes('vimeo.com') ? 'production.vimeo' : 'production.youtube')} ↗</a></div></div>${streamingMarkup(item)}</div>
  </article>`;
}
homeCatalog.innerHTML = productions.filter(item => !isHome || item.featured).map(productionMarkup).join('');
homeCatalog.addEventListener('click', event => {
  const button = event.target.closest('button[data-production]');
  if (!button || !button.isConnected) return;
  const item = productions.find(item => item.slug === button.dataset.production);
  const source = new URL(item.trailer);
  const mobile = event.pointerType === 'touch' || matchMedia('(max-width:760px), (hover:none) and (pointer:coarse)').matches;
  const iframe = document.createElement('iframe');
  if (source.hostname === 'vimeo.com') {
    const [,id,hash] = source.pathname.split('/');
    iframe.src = `https://player.vimeo.com/video/${id}?h=${hash}&autoplay=1&playsinline=1&muted=${mobile ? 1 : 0}&title=0&byline=0&portrait=0`;
  } else {
    iframe.src = `https://www.youtube-nocookie.com/embed/${source.searchParams.get('v')}?autoplay=1&playsinline=1&rel=0&hl=${LEP.lang}${mobile ? '&mute=1' : ''}`;
  }
  iframe.title = LEP.t('production.trailer') + ' ' + item.title;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  // Synchronous with the native click; remove image, title and all hit-test layers.
  button.closest('.production-screen').replaceChildren(iframe);
  if (!mobile) iframe.focus();
});
