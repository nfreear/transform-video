import TransformVideoElement from 'transform-video';

window.customElements.define('transform-video', TransformVideoElement);

const videoEl = document.querySelector('#video');

videoEl.addEventListener('command', (ev) => {
  if (ev.command === '--play-pause') {
    videoEl[videoEl.paused ? 'play' : 'pause']();
  }
  console.debug('command:', ev.command, ev);
  console.assert(ev.source.tagName === 'BUTTON', 'expecting source to be a <button>');
});

// ------------------------------------

/**
 * Optionally, load a JS environment file.
 */
if (/\?env/.test(import.meta.url)) {
  import('ENV').then(({ default: ENV }) => {
    console.assert(ENV.videoSrc, 'missing ENV.videoSrc');
    console.debug('ENV:', ENV);

    videoEl.src = ENV.videoSrc;
  });
}
