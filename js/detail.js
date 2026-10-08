// All detail routes use this template. Optional confirmed fields are omitted until supplied.
document.addEventListener('DOMContentLoaded', () => {
  const item = localizedProduction(productions.find(p => p.slug === document.body.dataset.production) || {});
  if (!item.slug) return;
  document.title = item.title + ' | LEP Filmes';
  document.querySelector('meta[name="description"]').content = item.synopsis;
  const external = (url, label) => `<a class="detail-link" href="${url}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span><span class="sr-only"> (${LEP.t('newTab')})</span></a>`;
  const rows = entries => `<dl class="credit-list">${entries.filter(([,value]) => value).map(([label,value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
  const section = (number,key,body) => `<section class="detail-section" aria-labelledby="detail-${number}"><h2 id="detail-${number}"><span>${number.padStart(2,'0')}</span>${LEP.t(key)}</h2>${body}</section>`;
  const image = item.images?.poster || item.images?.thumbnail || item.cover;
  const credits = (item.credits || []).filter(([label]) => !['Direção','Director','Gênero','Genre'].includes(label));
  const basic = rows([
    [LEP.t('detail.original'),item.title], [LEP.t('detail.local'),item.localTitle],
    [LEP.t('detail.year'),item.year], [LEP.t('detail.format'),[item.genre,item.type].filter(Boolean).join(' · ')],
    [LEP.t('detail.origin'),item.origin], [LEP.t('detail.duration'),item.duration], [LEP.t('detail.rating'),item.rating]
  ]);
  const team = rows([[LEP.t('production.director'),item.director],...credits]);
  const media = rows([[LEP.t('detail.synopsis'),item.synopsis],[LEP.t('detail.image'),external(basePath+image,LEP.t('detail.image'))],[LEP.t('detail.trailer'),item.trailer && external(item.trailer,LEP.t('production.watchTrailer'))]]);
  const distribution = streamingMarkup({...item,slug:item.slug+'-distribution'}) + (item.notes ? rows([[LEP.t('detail.notes'),item.notes]]) : '');
  document.getElementById('production-detail').innerHTML = `<article class="production-detail">
    <div class="detail-back"><a class="detail-link" href="${LEP.url(basePath+'pages/producoes.html')}">← ${LEP.t('detail.back')}</a></div>
    <div class="production-detail__hero"><div class="production-detail__image ${item.images?.poster ? 'has-poster' : 'has-cover'}"><img src="${basePath}${image}" alt="${LEP.t('production.cover')} ${item.title}"></div>
    <div class="production-detail__text"><h1>${item.title}</h1><p class="eyebrow">${item.type} · ${item.year}</p><p class="lead">${item.synopsis}</p>
    <div class="button-row">${item.trailer ? external(item.trailer,'▶ '+LEP.t('production.watchTrailer')) : ''}</div>${streamingMarkup(item)}</div></div>
    <div class="production-sheet">${section('1','detail.basic',basic)}${section('2','detail.team',team)}${section('3','detail.media',media)}${distribution ? section('4','detail.distribution',distribution) : ''}</div>
  </article>`;
});
