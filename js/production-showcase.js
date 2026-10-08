// Reusable views share catalogue, platform links and on-demand playback.
const homeCatalog = document.getElementById('featured-productions') || document.getElementById('catalog');
function productionMarkup(original) {
  const item = localizedProduction(original);
  const page = LEP.url(basePath + 'producoes/' + item.slug + '.html');
  const play = `<span class="trailer-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>`;
  return `<article class="home-production film-feature" aria-label="${item.title}">
    <div class="production-screen home-trailer film-media"><button type="button" class="trailer-cover" data-production="${item.slug}" aria-label="${LEP.t('production.play')} ${item.title}"><img class="film-still" src="${basePath}${(item.images?.thumbnail || item.trailerImage)}" alt="" loading="lazy">${play}</button><div class="film-overlay"><h2>${item.title}</h2><p>${item.director}</p></div></div>
    <div class="film-meta">${LEP.text(item.homeCategory)} • ${item.year}</div>
    <div class="home-production__body"><div><p class="home-production__synopsis">${item.synopsis}</p><a class="text-link production-cta" href="${page}">${LEP.t('production.more')} <span aria-hidden="true">↗</span></a></div>${streamingMarkup(item,true)}</div>
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
