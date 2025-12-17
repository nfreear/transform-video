import ENV from 'ENV';
import TransformVideoElement from 'TransformVideoElement';

customElements.define('transform-video', TransformVideoElement);

const videoEl = document.querySelector('#video');

console.debug('ENV:', ENV);

videoEl.src = ENV.videoSrc;

videoEl.addEventListener('command', (ev) => {
  if (ev.command === '--play-pause') {
    videoEl[videoEl.paused ? 'play' : 'pause']();
  }
  console.debug('command:', ev.command, ev);
});
