const { HTMLElement } = window;

/**
 * Transform video, for example, by splitting vertically.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas
 */
export default class TransformVideoElement extends HTMLElement {
  #canvas = { original: null, transform: null };

  get #isTopSplit () {
    const split = this.getAttribute('split');
    return (split && split !== 'bottom');
  }

  get #videoSelector () { return this.getAttribute('video-selector') ?? 'video'; }

  get #debug () { return this.hasAttribute('debug'); }

  get #videoElem () { return document.querySelector(this.#videoSelector); }

  get #videoHeight () { return this.#videoElem.videoHeight; }
  get #videoWidth () { return this.#videoElem.videoWidth; }
  get #videoRatio () { return this.#videoWidth / this.#videoHeight; } // E.g. 0.888888 (portrait);

  get #ctx1 () { return this.#canvas.original.getContext('2d', { willReadFrequently: true }); }
  get #ctx2 () { return this.#canvas.transform.getContext('2d'); }

  connectedCallback () {
    console.assert(this.#videoElem, '<video> element not found');

    this.attachShadow({ mode: 'open' });
    this.#canvas.original = this.#createCanvasElement(true);
    this.#canvas.transform = this.#createCanvasElement(false);

    this.#videoElem.addEventListener('play', (ev) => this.#onVideoPlay(ev));

    console.debug('transform-video:', [this]);
  }

  #onVideoPlay (ev) {
    this.#timerCallback();
    this.#setCanvasSizes();
    console.debug('video play:', ev);
  }

  #createCanvasElement (isOriginal = true) {
    const PART = isOriginal ? 'original hiddenCanvas' : 'transform splitCanvas';
    const canvasElem = document.createElement('canvas');

    canvasElem.setAttribute('part', `canvas ${PART}`);

    if (isOriginal && !this.#debug) {
      canvasElem.setAttribute('hidden', '');
    }

    this.shadowRoot.appendChild(canvasElem);
    return canvasElem;
  }

  #setCanvasSizes () {
    this.#canvas.original.setAttribute('height', this.#videoHeight);
    this.#canvas.original.setAttribute('width', this.#videoWidth);

    this.#canvas.transform.setAttribute('height', this.#videoHeight / 2);
    this.#canvas.transform.setAttribute('width', this.#videoWidth);
  }

  #timerCallback () {
    if (this.#videoElem.paused || this.#videoElem.ended) {
      return;
    }
    // this.#setCanvasSizes();
    this.#computeFrame();

    setTimeout(() => {
      this.#timerCallback();
    },
    0);
  }

  #computeFrame () {
    this.#ctx1.drawImage(this.#videoElem, 0, 0, this.#videoWidth, this.#videoHeight);
    const origFrame = this.#ctx1.getImageData(0, 0, this.#videoWidth, this.#videoHeight);

    if (this.#isTopSplit) {
      this.#ctx2.putImageData(origFrame, 0, 0, 0, 0, this.#videoWidth, this.#videoHeight / 2);
    } else {
      const offset = 0;

      const origStart = (origFrame.data.length / 2) + offset;
      const origLength = origFrame.data.length;
      const transFrame = this.#ctx2.createImageData(this.#videoWidth, this.#videoHeight / 2);

      let sp = 0;

      for (let i = origStart; i < origLength; i += 4) {
        transFrame.data[sp + 0] = origFrame.data[i + 0]; // Red.
        transFrame.data[sp + 1] = origFrame.data[i + 1]; // Green.
        transFrame.data[sp + 2] = origFrame.data[i + 2]; // Blue.
        transFrame.data[sp + 3] = origFrame.data[i + 3]; // Opacitiy.

        sp += 4;
        /* if (green > 100 && red > 100 && blue < 43) {
          data[i + 3] = 0;
        } */
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
      this.#ctx2.putImageData(transFrame, 0, 0, 0, 0, this.#videoWidth, this.#videoHeight / 2);
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
  #putImageData_NotInUse (
    ctx,
    imageData,
    dx,
    dy,
    dirtyX = 0,
    dirtyY = 0,
    dirtyWidth = imageData.width,
    dirtyHeight = imageData.height
  ) {
    const data = imageData.data;
    // const height = imageData.height;
    const width = imageData.width;
    const limitBottom = dirtyY + dirtyHeight;
    const limitRight = dirtyX + dirtyWidth;
    for (let y = dirtyY; y < limitBottom; y++) {
      for (let x = dirtyX; x < limitRight; x++) {
        const pos = y * width + x;
        ctx.fillStyle = `rgb(${data[pos * 4 + 0]} ${data[pos * 4 + 1]}
          ${data[pos * 4 + 2]} / ${data[pos * 4 + 3] / 255})`;
        ctx.fillRect(x + dx, y + dy, 1, 1);
      }
    }
  }
}
