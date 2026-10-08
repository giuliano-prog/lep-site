function streamingMarkup(item, logos = true) {
  if (!item.streaming?.length) return '';
  return `<div class="home-streaming"><p class="home-streaming__label" id="streaming-${item.slug}">${LEP.t('production.watch')}</p><ul aria-labelledby="streaming-${item.slug}">${(item.streaming || []).map(([id,url]) => {
    const platform = streamingPlatforms[id];
    return `<li><a class="${logos ? 'streaming-logo' : ''}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${platform.name} (${LEP.t('newTab')})" title="${platform.name}">${logos && platform.logo ? `<img src="${basePath}${platform.logo}" alt="${platform.name}" loading="lazy">` : platform.name}</a></li>`;
  }).join('')}</ul></div>`;
}
