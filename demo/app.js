import TransformVideoElement from 'TransformVideoElement';

window.customElements.define('transform-video', TransformVideoElement);

const videoEl = document.querySelector('#video');

videoEl.addEventListener('command', (ev) => {
  if (ev.command === '--play-pause') {
    videoEl[videoEl.paused ? 'play' : 'pause']();
  }
  console.debug('command:', ev.command, ev);
});

if (/\?env/.test(import.meta.url)) {
  import('ENV').then(({ default: ENV }) => {
    console.debug('ENV:', ENV);

    videoEl.src = ENV.videoSrc;
  });
}
