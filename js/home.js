document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('site-intro');
  if (!intro) return;
  const video = intro.querySelector('video');
  const sound = intro.querySelector('.intro-sound');
  // The audio track itself is attenuated, including on iOS where volume is device-controlled.
  sound.addEventListener('click', () => {
    video.muted = !video.muted;
    sound.setAttribute('aria-pressed', String(!video.muted));
    sound.textContent = video.muted ? 'Ativar som' : 'Desativar som';
  });
});
