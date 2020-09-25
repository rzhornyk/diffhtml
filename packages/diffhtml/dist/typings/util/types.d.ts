/**
 * @type {{ [type: string]: any }}
 */
export const EMPTY: {
    [type: string]: any;
};
export type PATCH_TYPE = {
    [type: string]: number;
};
/**
 * @typedef {{ [type: string]: number }} PATCH_TYPE
 * @type {PATCH_TYPE}
 */
export const PATCH_TYPE: PATCH_TYPE;
export type TransitionStateName = "attached" | "detached" | "replaced" | "attributeChanged" | "textChanged";
/**
 * @typedef {'attached' | 'detached' | 'replaced' | 'attributeChanged' | 'textChanged'} TransitionStateName
 * @type {TransitionStateName}
 */
export const TransitionStateName: TransitionStateName;
export type TransitionStateNames = ("attached" | "detached" | "replaced" | "attributeChanged" | "textChanged")[];
/**
 * @typedef {TransitionStateName[]} TransitionStateNames
 * @type {TransitionStateNames}
 */
export const TransitionStateNames: ("attached" | "detached" | "replaced" | "attributeChanged" | "textChanged")[];
export type VTree = {
    /**
     * - unaltered extracted nodeName
     */
    rawNodeName: any;
    /**
     * - lowercased, string, nodeName
     */
    nodeName: string;
    /**
     * - defines the text value associated
     */
    nodeValue: string;
    /**
     * - the type of Node this is representing
     */
    nodeType: number;
    /**
     * - A unique identifier for the children
     */
    key: string;
    /**
     * - Any nested elements
     */
    childNodes: VTree[];
    /**
     * - Any key/val attributes for the Node
     */
    attributes: any;
};
/**
 * @typedef {Object} VTree
 *
 * @property {any} rawNodeName - unaltered extracted nodeName
 * @property {string} nodeName - lowercased, string, nodeName
 * @property {string} nodeValue - defines the text value associated
 * @property {number} nodeType - the type of Node this is representing
 * @property {string} key - A unique identifier for the children
 * @property {VTree[]} childNodes - Any nested elements
 * @property {any} attributes - Any key/val attributes for the Node
 */
/**
 * @type {VTree}
 */
export const VTree: VTree;
export type VTreeLike = {
    /**
     * - unaltered extracted nodeName
     */
    rawNodeName?: any | undefined;
    /**
     * - lowercased, string, nodeName, only required value
     */
    nodeName: string;
    /**
     * - lowercased, string, elementName
     */
    elementName?: string | undefined;
    /**
     * - defines the text value associated
     */
    nodeValue?: string | undefined;
    /**
     * - the type of Node this is representing
     */
    nodeType?: number | undefined;
    /**
     * - A unique identifier for the children
     */
    key?: string | undefined;
    /**
     * - Any nested elements
     */
    childNodes?: VTreeLike[] | undefined;
    /**
     * - Any nested elements
     */
    children?: VTreeLike[] | undefined;
    /**
     * - Any key/val attributes for the Node
     */
    attributes?: any | undefined;
};
/**
 * @typedef {Object} VTreeLike

 * @property {any=} rawNodeName - unaltered extracted nodeName
 * @property {string} nodeName - lowercased, string, nodeName, only required value
 * @property {string=} elementName - lowercased, string, elementName
 * @property {string=} nodeValue - defines the text value associated
 * @property {number=} nodeType - the type of Node this is representing
 * @property {string=} key - A unique identifier for the children
 * @property {VTreeLike[]=} childNodes - Any nested elements
 * @property {VTreeLike[]=} children - Any nested elements
 * @property {any=} attributes - Any key/val attributes for the Node */
/**
 * @type {VTreeLike}
 */
export const VTreeLike: VTreeLike;
export type ValidInput = string | Function | HTMLElement | VTree | VTree[] | VTreeLike | Text | Comment | DocumentFragment | string[] | VTreeLike[];
/**
 * @typedef {HTMLElement | Text | Comment | DocumentFragment | Function | string | string[] | VTree | VTree[] | VTreeLike | VTreeLike[]} ValidInput
 * @type {ValidInput}
 */
export const ValidInput: ValidInput;
export type ValidNode = HTMLElement | Element | ChildNode | Text | DocumentFragment;
/**
 * @typedef {Element | HTMLElement | Text | DocumentFragment | ChildNode} ValidNode
 * @type {ValidNode}
 */
export const ValidNode: ValidNode;
export type Mount = HTMLElement | Element | ChildNode | VTree | VTree[] | VTreeLike | Text | DocumentFragment | VTreeLike[];
/**
 * @typedef {ValidNode | VTree | VTree[] | VTreeLike | VTreeLike[]} Mount
 * @type {Mount}
 */
export const Mount: Mount;
export type Middleware = {
    displayName?: string | undefined;
    subscribe?: Function | undefined;
    unsubscribe?: Function | undefined;
    createTreeHook?: Function | undefined;
    createNodeHook?: CreateNodeHookCallback | undefined;
    syncTreeHook?: Function | undefined;
    releaseHook?: Function | undefined;
    parseHook?: Function | undefined;
};
/**
 * @typedef {Object} Middleware
 *
 * @property {string=} displayName
 * @property {Function=} subscribe
 * @property {Function=} unsubscribe
 * @property {Function=} createTreeHook
 * @property {CreateNodeHookCallback=} createNodeHook
 * @property {Function=} syncTreeHook
 * @property {Function=} releaseHook
 * @property {Function=} parseHook
 */
/**
 * @type {Middleware}
 */
export const Middleware: Middleware;
export type ParserOptions = {
    /**
     * - Should the parser operate in strict mode
     */
    strict?: boolean | undefined;
    /**
     * - Trim surrounding whitespace nodes
     */
    trim?: boolean | undefined;
    /**
     * - Set of raw tagNames, empty is all
     */
    rawElements?: string[] | undefined;
    /**
     * - Set of self closing element tagNames, empty is all
     */
    selfClosingElements?: string[] | undefined;
};
/**
 * @typedef {Object} ParserOptions
 *
 * @property {Boolean=} strict - Should the parser operate in strict mode
 * @property {Boolean=} trim - Trim surrounding whitespace nodes
 * @property {string[]=} rawElements - Set of raw tagNames, empty is all
 * @property {string[]=} selfClosingElements - Set of self closing element tagNames, empty is all
 */
/**
 * @type {ParserOptions}
 */
export const ParserOptions: ParserOptions;
export type Options = {
    /**
     * - to diff children or root
     */
    inner?: boolean | undefined;
    /**
     * - to execute scripts or not
     */
    executeScripts?: boolean | undefined;
    /**
     * - to override tasks
     */
    tasks?: Function[] | undefined;
    /**
     * - override parser options
     */
    parser?: ParserOptions | undefined;
};
/**
* @typedef {Object} Options
*
* @property {Boolean=} inner - to diff children or root
* @property {Boolean=} executeScripts - to execute scripts or not
* @property {Function[]=} tasks - to override tasks
* @property {ParserOptions=} parser - override parser options
*/
/**
 * @type {Options}
 */
export const Options: Options;
export type Supplemental = {
    tags: {
        [key: string]: any;
    };
    attributes: {
        [key: string]: any;
    };
    children: {
        [key: string]: any;
    };
};
/**
 * @typedef {Object} Supplemental
 *
 * @property {{ [key: string]: any }} tags
 * @property {{ [key: string]: any }} attributes
 * @property {{ [key: string]: any }} children
 */
/**
 * @type {Supplemental}
 */
export const Supplemental: Supplemental;
export type TransactionState = {
    measure: Function;
    svgElements: Set<VTree>;
    scriptsToExecute: Map<VTree, string | undefined>;
    markup?: ValidInput | undefined;
    oldTree?: VTree | undefined;
    isRendering?: boolean | undefined;
    previousMarkup?: string | undefined;
    activeTransaction?: any | undefined;
    nextTransaction?: any | undefined;
    ownerDocument?: Document | undefined;
};
/**
 * @typedef {Object} TransactionState
 *
 * @property {Function} measure
 * @property {Set<VTree>} svgElements
 * @property {Map<VTree, string | undefined>} scriptsToExecute
 * @property {ValidInput=} markup
 * @property {VTree=} oldTree
 * @property {Boolean=} isRendering
 * @property {String=} previousMarkup
 * @property {any=} activeTransaction
 * @property {any=} nextTransaction
 * @property {Document=} ownerDocument
*/
/**
 * @type {TransactionState}
 */
export const TransactionState: TransactionState;
/**
 * Associates active transaction mount with state.
 */
export type StateCache = Map<HTMLElement | Element | ChildNode | VTree | VTree[] | VTreeLike | Text | DocumentFragment | VTreeLike[], TransactionState>;
/**
 * Associates active transaction mount with state.
 *
 * @typedef {Map<Mount, TransactionState>} StateCache
 * @type {StateCache}
 */
export const StateCache: Map<HTMLElement | Element | ChildNode | VTree | VTree[] | VTreeLike | Text | DocumentFragment | VTreeLike[], TransactionState>;
/**
 * Associates a VTree with a distinctive DOM Node.
 */
export type NodeCache = Map<VTree, HTMLElement | Element | ChildNode | Text | DocumentFragment>;
/**
 * Associates a VTree with a distinctive DOM Node.
 *
 * @typedef {Map<VTree, ValidNode>} NodeCache
 */
/**
 * @type {NodeCache} implements NodeCache
 */
export const NodeCache: Map<VTree, HTMLElement | Element | ChildNode | Text | DocumentFragment>;
/**
 * Creates a mapping of TransitionState
 */
export type TransitionCache = Map<"attached" | "detached" | "replaced" | "attributeChanged" | "textChanged", Set<Function>>;
/**
 * Creates a mapping of TransitionState
 *
 * @typedef {Map<TransitionStateName, Set<Function>>} TransitionCache
 * @type {TransitionCache}
 */
export const TransitionCache: Map<"attached" | "detached" | "replaced" | "attributeChanged" | "textChanged", Set<Function>>;
/**
 * Stores middleware functions/objects which hook into the render flow.
 */
export type MiddlewareCache = Set<Function>;
/**
 * Stores middleware functions/objects which hook into the render flow.
 *
 * @typedef {Set<Function>} MiddlewareCache
 * @type {MiddlewareCache}
 */
export const MiddlewareCache: Set<Function>;
export type CreateTreeHookCache = Set<Function>;
/**
 * @typedef {Set<Function>} CreateTreeHookCache
 * @type {CreateTreeHookCache}
 */
export const CreateTreeHookCache: Set<Function>;
export type CreateNodeHookCache = Set<(vTree: VTree) => ValidNode | void>;
/**
 * @typedef {(vTree: VTree) => ValidNode | void} CreateNodeHookCallback
 * @typedef {Set<CreateNodeHookCallback>} CreateNodeHookCache
 * @type {CreateNodeHookCache}
 */
export const CreateNodeHookCache: Set<(vTree: VTree) => ValidNode | void>;
export type SyncTreeHookCache = Set<Function>;
/**
 * @typedef {Set<Function>} SyncTreeHookCache
 * @type {SyncTreeHookCache}
 */
export const SyncTreeHookCache: Set<Function>;
export type ReleaseHookCache = Set<Function>;
/**
 * @typedef {Set<Function>} ReleaseHookCache
 * @type {ReleaseHookCache}
 */
export const ReleaseHookCache: Set<Function>;
export type ParseHookCache = Set<Function>;
/**
 * @typedef {Set<Function>} ParseHookCache
 * @type {ParseHookCache}
 */
export const ParseHookCache: Set<Function>;
export type Internals = {
    VERSION?: string | undefined;
    decodeEntities: Function;
    escape: Function;
    makeMeasure: Function;
    memory: object;
    Pool: object;
    process: object;
    PATCH_TYPE: PATCH_TYPE;
    parse?: Function | undefined;
    createNode: Function;
    syncTree: Function;
    Transaction: Function;
    defaultTasks: object;
    tasks: object;
    StateCache: Map<HTMLElement | Element | ChildNode | VTree | VTree[] | VTreeLike | Text | DocumentFragment | VTreeLike[], TransactionState>;
    NodeCache: Map<VTree, HTMLElement | Element | ChildNode | Text | DocumentFragment>;
    TransitionCache: Map<"attached" | "detached" | "replaced" | "attributeChanged" | "textChanged", Set<Function>>;
    MiddlewareCache: Set<Function>;
    CreateTreeHookCache: Set<Function>;
    CreateNodeHookCache: Set<(vTree: VTree) => ValidNode | void>;
    SyncTreeHookCache: Set<Function>;
    ReleaseHookCache: Set<Function>;
    ParseHookCache: Set<Function>;
};
/**
 * @typedef {Object} Internals
 *
 * @property {string=} VERSION
 * @property {Function} decodeEntities
 * @property {Function} escape
 * @property {Function} makeMeasure
 * @property {object} memory
 * @property {object} Pool
 * @property {object} process
 * @property {PATCH_TYPE} PATCH_TYPE
 * @property {Function=} parse
 * @property {Function} createNode
 * @property {Function} syncTree
 * @property {Function} Transaction
 * @property {object} defaultTasks
 * @property {object} tasks
 * @property {StateCache} StateCache
 * @property {NodeCache} NodeCache
 * @property {TransitionCache} TransitionCache
 * @property {MiddlewareCache} MiddlewareCache
 * @property {CreateTreeHookCache} CreateTreeHookCache
 * @property {CreateNodeHookCache} CreateNodeHookCache
 * @property {SyncTreeHookCache} SyncTreeHookCache
 * @property {ReleaseHookCache} ReleaseHookCache
 * @property {ParseHookCache} ParseHookCache
 */
/**
 * @type {Internals}
 */
export const Internals: Internals;
export type CreateNodeHookCallback = (vTree: VTree) => ValidNode | void;
