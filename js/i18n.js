// PT is the default. Explicit, shareable URLs preserve language without tracking/storage.
window.LEP = (() => {
  const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'pt';
  const t = key => LEP_MESSAGES[key]?.[lang === 'en' ? 1 : 0] ?? key;
  const text = value => typeof value === 'object' ? value[lang] ?? value.pt : value;
  const url = (href, language = lang) => {
    const target = new URL(href, location.href);
    if (language === 'en') target.searchParams.set('lang', 'en');
    else target.searchParams.delete('lang');
    return target.pathname + target.search + target.hash;
  };
  const apply = (root = document) => {
    root.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    root.querySelectorAll('[data-i18n-alt]').forEach(el => el.setAttribute('alt', t(el.dataset.i18nAlt)));
    root.querySelectorAll('[data-i18n-content]').forEach(el => el.setAttribute('content', t(el.dataset.i18nContent)));
    root.querySelectorAll('a[href]').forEach(link => {
      if (link.hasAttribute('data-language')) return;
      const target = new URL(link.href, location.href);
      if (target.origin === location.origin && /(?:\.html|\/)$/i.test(target.pathname)) link.href = url(target.href);
    });
  };
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  document.addEventListener('DOMContentLoaded', () => { apply(); requestAnimationFrame(() => apply()); });
  return { lang, t, text, url, apply };
})();
