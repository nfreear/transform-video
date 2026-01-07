
# transform-video #

[![Node.js][ci-badge]][ci]

A custom element to manipulate video using `<canvas>` elements. It currently supports splitting a video vertically into two equal areas.

## Usage

Example HTML:
```html
<video src="path/to/video.mp4"></video>

<transform-video split="bottom"></transform-video>

<transform-video split="top"></transform-video>
```

JavaScript and a CSS stylesheet are available via the [esm.sh][] [CDN][]:
```html
<link rel="stylesheet" href="https://esm.sh/gh/nfreear/transform-video/style">

<script type="importmap">
{
  "imports": {
    "transform-video": "https://esm.sh/gh/nfreear/transform-video?raw",
    "demo-app": "https://esm.sh/gh/nfreear/transform-video/app?raw"
  }
}
</script>

<script type="module">
  import 'demo-app';
</script>
```

[ci]: https://github.com/nfreear/transform-video/actions/workflows/node.js.yml
[ci-badge]: https://github.com/nfreear/transform-video/actions/workflows/node.js.yml/badge.svg

[cdn]: https://esm.sh/gh/nfreear/transform-video?keep-names&raw
[esm.sh]: https://esm.sh/
