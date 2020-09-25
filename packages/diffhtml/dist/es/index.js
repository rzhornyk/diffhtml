import createTree from "./tree/create.js";
import parseNewTree from "./tasks/parse-new-tree.js";
import reconcileTrees from "./tasks/reconcile-trees.js";
import internals from "./util/internals.js";
import parse from "./util/parse.js";
import globalThis, { bindingSymbol } from "./util/global.js";
import innerHTML from "./inner-html.js";
import outerHTML from "./outer-html.js";
import { defaultTasks } from "./transaction.js";
import html from "./html.js";
import release from "./release.js";
import use from "./use.js";
import { addTransitionState, removeTransitionState } from "./transition.js";
import { __VERSION__ as VERSION } from "./version.js"; // At startup inject the HTML parser into the default set of tasks.

defaultTasks.splice(defaultTasks.indexOf(reconcileTrees), 0, parseNewTree); // Add build flavor internals when executed.

internals.parse = parse;
internals.VERSION = VERSION; // Build up the full public API.

const api = {};
api.VERSION = VERSION;
api.addTransitionState = addTransitionState;
api.removeTransitionState = removeTransitionState;
api.release = release;
api.createTree = createTree;
api.use = use;
api.outerHTML = outerHTML;
api.innerHTML = innerHTML;
api.html = html;
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
  }
} else {
  global[bindingSymbol] = api; // Automatically hook up to DevTools if they are present.

  if (global.devTools) {
    global.unsubscribeDevTools = use(global.devTools(internals));
  }
}

export { VERSION, addTransitionState, removeTransitionState, release, createTree, use, outerHTML, innerHTML, html, internals as Internals };
export default api;