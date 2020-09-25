"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Internals = exports.ParseHookCache = exports.ReleaseHookCache = exports.SyncTreeHookCache = exports.CreateNodeHookCache = exports.CreateTreeHookCache = exports.MiddlewareCache = exports.TransitionCache = exports.NodeCache = exports.StateCache = exports.TransactionState = exports.Supplemental = exports.Options = exports.ParserOptions = exports.Middleware = exports.Mount = exports.ValidNode = exports.ValidInput = exports.VTreeLike = exports.VTree = exports.TransitionStateNames = exports.TransitionStateName = exports.PATCH_TYPE = exports.EMPTY = void 0;

/**
 * @type {{ [type: string]: any }}
 */
const EMPTY = {
  STR: '',
  NUM: 1,
  OBJ: {},
  ARR: [],
  FUNC: () => {},
  MAP: new Map(),
  SET: new Set(),
  DOM:
  /** @type {HTMLElement} */
  {}
};
/**
 * @typedef {{ [type: string]: number }} PATCH_TYPE
 * @type {PATCH_TYPE}
 */

exports.EMPTY = EMPTY;
const PATCH_TYPE = {
  'SET_ATTRIBUTE': 0,
  'REMOVE_ATTRIBUTE': 1,
  'NODE_VALUE': 2,
  'INSERT_BEFORE': 3,
  'REPLACE_CHILD': 4,
  'REMOVE_CHILD': 5
};
/**
 * @typedef {'attached' | 'detached' | 'replaced' | 'attributeChanged' | 'textChanged'} TransitionStateName
 * @type {TransitionStateName}
 */

exports.PATCH_TYPE = PATCH_TYPE;
const TransitionStateName = 'attached';
/**
 * @typedef {TransitionStateName[]} TransitionStateNames
 * @type {TransitionStateNames}
 */

exports.TransitionStateName = TransitionStateName;
const TransitionStateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];
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

exports.TransitionStateNames = TransitionStateNames;
const VTree = {
  rawNodeName: EMPTY.STR,
  nodeName: EMPTY.STR,
  nodeValue: EMPTY.STR,
  nodeType: EMPTY.NUM,
  key: EMPTY.STR,
  childNodes: EMPTY.ARR,
  attributes: EMPTY.OBJ
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

exports.VTree = VTree;
const VTreeLike = {
  nodeName: EMPTY.STR
};
/**
 * @typedef {HTMLElement | Text | Comment | DocumentFragment | Function | string | string[] | VTree | VTree[] | VTreeLike | VTreeLike[]} ValidInput
 * @type {ValidInput}
 */

exports.VTreeLike = VTreeLike;
const ValidInput = EMPTY.STR;
/**
 * @typedef {Element | HTMLElement | Text | DocumentFragment | ChildNode} ValidNode
 * @type {ValidNode}
 */

exports.ValidInput = ValidInput;
const ValidNode = EMPTY.DOM;
/**
 * @typedef {ValidNode | VTree | VTree[] | VTreeLike | VTreeLike[]} Mount
 * @type {Mount}
 */

exports.ValidNode = ValidNode;
const Mount = EMPTY.STR;
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

exports.Mount = Mount;
const Middleware = {};
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

exports.Middleware = Middleware;
const ParserOptions = {};
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

exports.ParserOptions = ParserOptions;
const Options = {};
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

exports.Options = Options;
const Supplemental = {
  attributes: EMPTY.OBJ,
  tags: EMPTY.OBJ,
  children: EMPTY.OBJ
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

exports.Supplemental = Supplemental;
const TransactionState = {
  measure: EMPTY.FUNC,
  svgElements: EMPTY.SET,
  scriptsToExecute: EMPTY.MAP
};
/**
 * Associates active transaction mount with state.
 *
 * @typedef {Map<Mount, TransactionState>} StateCache
 * @type {StateCache}
 */

exports.TransactionState = TransactionState;
const StateCache = new Map();
/**
 * Associates a VTree with a distinctive DOM Node.
 *
 * @typedef {Map<VTree, ValidNode>} NodeCache
 */

/**
 * @type {NodeCache} implements NodeCache
 */

exports.StateCache = StateCache;
const NodeCache = new Map();
/**
 * Creates a mapping of TransitionState
 *
 * @typedef {Map<TransitionStateName, Set<Function>>} TransitionCache
 * @type {TransitionCache}
 */

exports.NodeCache = NodeCache;
const TransitionCache = new Map([['attached', new Set()], ['detached', new Set()], ['replaced', new Set()], ['attributeChanged', new Set()], ['textChanged', new Set()]]);
/**
 * Stores middleware functions/objects which hook into the render flow.
 *
 * @typedef {Set<Function>} MiddlewareCache
 * @type {MiddlewareCache}
 */

exports.TransitionCache = TransitionCache;
const MiddlewareCache = new Set();
/**
 * @typedef {Set<Function>} CreateTreeHookCache
 * @type {CreateTreeHookCache}
 */

exports.MiddlewareCache = MiddlewareCache;
const CreateTreeHookCache = new Set();
/**
 * @typedef {(vTree: VTree) => ValidNode | void} CreateNodeHookCallback
 * @typedef {Set<CreateNodeHookCallback>} CreateNodeHookCache
 * @type {CreateNodeHookCache}
 */

exports.CreateTreeHookCache = CreateTreeHookCache;
const CreateNodeHookCache = new Set();
/**
 * @typedef {Set<Function>} SyncTreeHookCache
 * @type {SyncTreeHookCache}
 */

exports.CreateNodeHookCache = CreateNodeHookCache;
const SyncTreeHookCache = new Set();
/**
 * @typedef {Set<Function>} ReleaseHookCache
 * @type {ReleaseHookCache}
 */

exports.SyncTreeHookCache = SyncTreeHookCache;
const ReleaseHookCache = new Set();
/**
 * @typedef {Set<Function>} ParseHookCache
 * @type {ParseHookCache}
 */

exports.ReleaseHookCache = ReleaseHookCache;
const ParseHookCache = new Set();
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

exports.ParseHookCache = ParseHookCache;
const Internals = {
  decodeEntities: EMPTY.FUNC,
  escape: EMPTY.FUNC,
  makeMeasure: EMPTY.FUNC,
  memory: EMPTY.OBJ,
  Pool: EMPTY.OBJ,
  process: EMPTY.OBJ,
  PATCH_TYPE: EMPTY.OBJ,
  parse: EMPTY.FUNC,
  createNode: EMPTY.FUNC,
  syncTree: EMPTY.FUNC,
  Transaction: EMPTY.FUNC,
  defaultTasks: EMPTY.OBJ,
  tasks: EMPTY.OBJ,
  StateCache: EMPTY.MAP,
  NodeCache: EMPTY.MAP,
  TransitionCache: EMPTY.MAP,
  MiddlewareCache: EMPTY.SET,
  CreateNodeHookCache: EMPTY.SET,
  CreateTreeHookCache: EMPTY.SET,
  SyncTreeHookCache: EMPTY.SET,
  ReleaseHookCache: EMPTY.SET,
  ParseHookCache: EMPTY.SET
};
exports.Internals = Internals;