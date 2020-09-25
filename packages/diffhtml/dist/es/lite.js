import createTree from "./tree/create.js";
import internals from "./util/internals.js";
import globalThis, { bindingSymbol } from "./util/global.js";
import innerHTML from "./inner-html.js";
import outerHTML from "./outer-html.js";
import release from "./release.js";
import use from "./use.js";
import { addTransitionState, removeTransitionState } from "./transition.js";
import { __VERSION__ } from "./version.js";
const {
  assign
} = Object;
const VERSION = `${__VERSION__}-lite`; // Exposes the Internal APIs which may change. Once this project reaches a
// stable version, this will only be able to break between major versions.

assign(internals, {
  VERSION
});
const api = {};
api.VERSION = VERSION;
api.addTransitionState = addTransitionState;
api.removeTransitionState = removeTransitionState;
api.release = release;
api.createTree = createTree;
api.use = use;
api.outerHTML = outerHTML;
api.innerHTML = innerHTML;
api.html = createTree;
api.Internals = internals;
/** @type {any} */

const global = globalThis; // Bind the API into the global scope. Allows middleware and other code to
// reference the core API.

const hasBinding = (bindingSymbol in globalThis); // The first API binding wins and if you use static-sync or accidentally bundle
// multiple versions they will not cause conflicts.

if (hasBinding) {
  const existingApi = global[bindingSymbol];

  if (VERSION !== existingApi.VERSION) {
    console.log(`Tried to load ${VERSION} after ${existingApi.VERSION}`);
  } // Merge the existing API in.


  assign(api, global[bindingSymbol]);
} else {
  global[bindingSymbol] = api; // Automatically hook up to DevTools if they are present.

  if (global.devTools) {
    global.unsubscribeDevTools = use(global.devTools(internals));
  }
}

export { VERSION, addTransitionState, removeTransitionState, release, createTree, use, outerHTML, innerHTML, createTree as html, internals as Internals };
export default api;