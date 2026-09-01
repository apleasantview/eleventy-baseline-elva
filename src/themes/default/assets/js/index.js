// Single esbuild entry point for the theme's scripts.
//
// Order is load-bearing, and stating it is the reason this file exists. scripts.js and search.js
// register their components on the `alpine:init` event; alpine.js calls Alpine.start(), which is
// what fires that event. Start has to come last, and an import list says so in a way that two
// `defer` script tags relying on document order never could.
//
// Baseline's compile guard only ever processes an `index.js` under the assets js directory
// (modules/assets/index.js:99), so the name is the convention rather than a choice.

import './scripts.js';
import './search.js';
import './alpine.js';
