export default api;
import { __VERSION__ as VERSION } from "./version";
import { addTransitionState } from "./transition";
import { removeTransitionState } from "./transition";
import release from "./release";
import createTree from "./tree/create";
import use from "./use";
import outerHTML from "./outer-html";
import innerHTML from "./inner-html";
import html from "./html";
import internals from "./util/internals";
declare namespace api {
    export { VERSION };
    export { addTransitionState };
    export { removeTransitionState };
    export { release };
    export { createTree };
    export { use };
    export { outerHTML };
    export { innerHTML };
    export { html };
    export { internals as Internals };
}
export { VERSION, addTransitionState, removeTransitionState, release, createTree, use, outerHTML, innerHTML, html, internals as Internals };
