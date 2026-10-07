document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('site-intro');
  if (!intro) return;
  const video = intro.querySelector('video');
  const sound = intro.querySelector('.intro-sound');
  const syncSound = () => {
    sound.setAttribute('aria-pressed', String(!video.muted));
    sound.textContent = video.muted ? 'Ativar som' : 'Desativar som';
  };
  // The audio track itself is attenuated, including on iOS where volume is device-controlled.
  sound.addEventListener('click', () => {
    if (!intro.open || intro.classList.contains('is-leaving')) return;
    video.muted = !video.muted;
    syncSound();
    if (!video.muted && matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)').matches) {
      // Safari may pause when audio is enabled. Resume inside this same user gesture.
      video.play().catch(() => {
        if (!intro.open || intro.classList.contains('is-leaving')) return;
        video.muted = true;
        syncSound();
        // If playback is still denied, reuse the existing smooth entrance fallback.
        video.play().catch(() => {
          if (intro.open && !intro.classList.contains('is-leaving')) intro.querySelector('.intro-skip').click();
        });
      });
    }
  });
  video.addEventListener('volumechange', syncSound);
});
