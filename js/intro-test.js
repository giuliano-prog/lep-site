/* Preview opt-in: ?intro=teste or ?intro=atual, on localhost/file only.
   Without a recognized preview parameter, the existing intro runs unchanged. */
(() => {
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.protocol === 'file:';
  const choice = new URLSearchParams(location.search).get('intro');
  const preview = local && ['teste', 'atual'].includes(choice);
  if (!preview) return;

  // Explicit comparison links replay the original even if it was already seen in this tab.
  if (choice === 'atual') {
    try { sessionStorage.removeItem('lep-intro-seen'); } catch (_) { /* Storage can be disabled. */ }
  }

  function comparisonTools() {
    const panel = document.createElement('nav');
    panel.className = 'intro-preview-tools';
    panel.setAttribute('aria-label', 'Comparar aberturas localmente');
    panel.innerHTML = '<span>Teste local</span>';
    for (const [value, label] of [['atual', 'Atual'], ['teste', 'Nova']]) {
      const link = document.createElement('a');
      const url = new URL(location.href);
      url.searchParams.set('intro', value);
      link.href = url.href;
      link.textContent = label;
      if (choice === value) link.setAttribute('aria-current', 'page');
      panel.append(link);
    }
    const replay = document.createElement('button');
    replay.textContent = 'Repetir';
    replay.addEventListener('click', () => location.reload());
    const close = document.createElement('button');
    close.textContent = '×';
    close.setAttribute('aria-label', 'Fechar controles de teste');
    close.addEventListener('click', () => panel.remove());
    panel.append(replay, close);
    document.body.append(panel);
  }

  window.LEPIntroTest = {
    start() {
      comparisonTools();
      if (choice !== 'teste') return false;
      // Respect motion preferences; never fall through to the video in test mode.
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return true;

      const dialog = document.createElement('dialog');
      dialog.className = 'intro-test';
      dialog.setAttribute('aria-label', 'Abertura alternativa da LEP Filmes');
      dialog.innerHTML = `<div class="intro-test__stage">
        <span class="intro-test__line intro-test__line--first" aria-hidden="true"></span>
        <div class="intro-test__reveal"><span class="intro-test__mark"><img src="assets/brand/20250715_LEP_Filmes_White.png" alt="LEP Filmes" decoding="async"></span></div>
        <span class="intro-test__line intro-test__line--last" aria-hidden="true"></span>
      </div><button class="intro-test__skip" autofocus>Pular abertura ↗</button>`;
      document.body.append(dialog);
      document.body.classList.add('intro-test-open');
      let finished = false;
      let holdTimer;
      let endTimer;
      const cleanup = () => {
        clearTimeout(holdTimer);
        clearTimeout(endTimer);
        dialog.close();
        dialog.remove();
        document.body.classList.remove('intro-test-open');
      };
      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(holdTimer);
        dialog.classList.add('is-leaving');
        endTimer = setTimeout(cleanup, 600);
      };
      dialog.querySelector('button').addEventListener('click', finish);
      dialog.addEventListener('cancel', event => { event.preventDefault(); finish(); });
      dialog.showModal();
      // 3.6 seconds for reveal/hold + 0.6 seconds for the dissolve = 4.2 seconds.
      holdTimer = setTimeout(finish, 3600);
      dialog.querySelector('.intro-test__reveal').addEventListener('animationend', () => {
        if (!finished) dialog.dataset.phase = 'hold';
      }, { once: true });
      const mark = dialog.querySelector('img');
      mark.decode().then(() => {
        if (!finished) dialog.classList.add('is-playing');
      }).catch(finish);
      return true;
    }
  };
})();
