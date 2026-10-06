document.addEventListener('DOMContentLoaded', () => {
  const item = productions.find(p => p.slug === document.body.dataset.production);
  if (!item) return;
  const actions = [
    item.trailer && `<a class="button" target="_blank" rel="noreferrer" href="${item.trailer}">▶ Assistir trailer</a>`,
    item.netflix && `<a class="button-quiet" target="_blank" rel="noreferrer" href="${item.netflix}">Netflix ↗</a>`,
    item.instagram && `<a class="button-quiet" target="_blank" rel="noreferrer" href="${item.instagram}">◎ Ver no Instagram</a>`
  ].filter(Boolean).join('');
  const credits = item.credits.length ? `<section class="section section--ink"><div class="detail-data" data-reveal><div><p class="eyebrow">Ficha técnica selecionada</p><h2 class="display">Quem faz<br>acontecer.</h2></div><dl class="credit-list">${item.credits.map(c => `<div><dt>${c[0]}</dt><dd>${c[1]}</dd></div>`).join('')}</dl></div></section>` : '';
  const note = item.notes ? `<section class="section"><p class="note">${item.notes}</p></section>` : '';
  document.getElementById('production-detail').innerHTML = `<section class="production-detail"><div class="production-detail__hero"><div class="production-detail__image"><img src="../${item.cover}" alt="Capa de ${item.title}"></div><div class="production-detail__text"><p class="eyebrow">${item.type}${item.year ? ` · ${item.year}` : ''}</p><h1 class="display">${item.title}</h1><p class="lead">${item.synopsis}</p><div class="button-row">${actions}</div></div></div>${note}${credits}</section>`;
});
