const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const pages = ['index.html', ...['pages', 'producoes'].flatMap(dir => fs.readdirSync(path.join(root, dir)).filter(f => f.endsWith('.html')).map(f => `${dir}/${f}`))];
function context(search = '') {
  const location = new URL(`https://lep.example/index.html${search}`);
  const ctx = vm.createContext({ URL, URLSearchParams, location, window: {}, document: { documentElement: {}, addEventListener() {} } });
  vm.runInContext(read('js/translations.js') + '\n' + read('js/i18n.js') + '\nconst LEP = window.LEP;\n' + read('js/productions.js'), ctx);
  return ctx;
}

test('all editorial keys used by pages and scripts have both languages', () => {
  const ctx = context();
  const messages = vm.runInContext('LEP_MESSAGES', ctx);
  for (const [key, values] of Object.entries(messages)) {
    assert.equal(values.length, 2, key);
    assert.ok(values.every(value => typeof value === 'string' && value.trim()), key);
  }
  const files = [...pages, ...fs.readdirSync(path.join(root, 'js')).map(f => `js/${f}`)];
  for (const file of files) {
    const source = read(file);
    for (const match of source.matchAll(/data-i18n(?:-aria|-alt|-content)?="([\w.]+)"|LEP\.t\(['"]([\w.]+)['"]\)/g)) {
      assert.ok(messages[match[1] || match[2]], `${file}: ${match[1] || match[2]}`);
    }
  }
});

test('language URLs preserve route, intro query and anchor; PT is the default', () => {
  const pt = context();
  assert.equal(pt.window.LEP.lang, 'pt');
  const en = context('?intro=teste&lang=en#catalog');
  assert.equal(en.window.LEP.lang, 'en');
  assert.equal(en.document.documentElement.lang, 'en');
  assert.equal(en.window.LEP.url('https://lep.example/index.html?intro=teste&lang=en#catalog', 'pt'), '/index.html?intro=teste#catalog');
  assert.equal(en.window.LEP.url('/pages/equipe.html'), '/pages/equipe.html?lang=en');
  assert.equal(context('?lang=invalid').window.LEP.lang, 'pt');
});

test('catalogue entries have complete translated content, valid assets and detail routes', () => {
  const ctx = context('?lang=en');
  const items = vm.runInContext('productions', ctx);
  const platforms = vm.runInContext('streamingPlatforms', ctx);
  assert.equal(new Set(items.map(p => p.slug)).size, items.length);
  for (const item of items) {
    assert.ok(item.en.type && item.en.synopsis, item.slug);
    if (item.notes) assert.ok(item.en.notes, item.slug);
    if (item.credits.length) assert.equal(item.en.credits.length, item.credits.length, item.slug);
    for (const file of [item.cover, item.trailerImage, `producoes/${item.slug}.html`]) assert.ok(fs.existsSync(path.join(root, file)), file);
    assert.ok(['www.youtube.com', 'vimeo.com'].includes(new URL(item.trailer).hostname));
    for (const [platform, url] of item.streaming) {
      assert.equal(new URL(url).protocol, 'https:');
      assert.ok(platforms[platform].name, platform);
      if (platforms[platform].logo) assert.ok(fs.existsSync(path.join(root, platforms[platform].logo)), platform);
    }
  }
  assert.deepEqual(Array.from(items.filter(p => p.featured), p => p.slug), ['a-conspiracao-condor', 'ronaldinho-gaucho', 'abre-a-coxia']);
  for (const item of items) {
    for (const asset of Object.values(item.images).filter(Boolean)) assert.ok(fs.existsSync(path.join(root, asset)), asset);
  }
});

test('every page loads shared navigation dependencies and local references exist', () => {
  for (const file of pages) {
    const html = read(file);
    for (const script of ['translations', 'i18n', 'productions', 'site']) assert.ok(html.includes(`js/${script}.js`), `${file}: ${script}`);
    assert.ok(html.indexOf('js/productions.js') < html.indexOf('js/site.js'), file);
    for (const [, href] of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
      if (/^(?:https?:|mailto:|data:)/.test(href)) continue;
      assert.ok(fs.existsSync(path.resolve(root, path.dirname(file), href)), `${file}: ${href}`);
    }
  }
});
