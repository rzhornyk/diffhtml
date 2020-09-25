function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import Transaction, { defaultTasks, tasks } from "../transaction.js";
import createNode from "../node/create.js";
import syncTree from "../tree/sync.js";
import * as caches from "./caches.js";
import decodeEntities from "./decode-entities.js";
import escape from "./escape.js";
import makeMeasure from "./make-measure.js";
import * as memory from "./memory.js";
import Pool from "./pool.js";
import process from "./process.js";
import { PATCH_TYPE, Internals } from "./types.js";
export default
/** @type {Internals} */
_objectSpread({
  // Utils.
  decodeEntities,
  escape,
  makeMeasure,
  memory,
  Pool,
  process,
  PATCH_TYPE,
  // Core.
  createNode,
  syncTree,
  // Tasks.
  Transaction,
  defaultTasks,
  tasks
}, caches);