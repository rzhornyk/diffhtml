export default api;
export const VERSION: string;
import { addTransitionState } from "./transition";
import { removeTransitionState } from "./transition";
import release from "./release";
import createTree from "./tree/create";
import use from "./use";
import outerHTML from "./outer-html";
import innerHTML from "./inner-html";
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
    export { createTree as html };
    export { internals as Internals };
}
export { addTransitionState, removeTransitionState, release, createTree, use, outerHTML, innerHTML, createTree as html, internals as Internals };
