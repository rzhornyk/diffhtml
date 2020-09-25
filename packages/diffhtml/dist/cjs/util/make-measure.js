"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeMeasure;
exports.prefix = exports.marks = void 0;

var _types = require("./types");

var _process = _interopRequireDefault(require("./process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const marks = new Map();
exports.marks = marks;
const prefix = 'diffHTML';
exports.prefix = prefix;
const DIFF_PERF = 'diff_perf';
const hasSearch = typeof location !== 'undefined';
const hasArguments = _process.default.argv;

const nop = () => {};
/**
 *
 * @param {Mount} domNode
 * @param {ValidInput=} input
 * @return {(name: string) => void}
 */


function makeMeasure(domNode, input) {
  // Check for these changes on every check.
  const wantsSearch = hasSearch && location.search.includes(DIFF_PERF);

  const wantsArguments = hasArguments && _process.default.argv.includes(DIFF_PERF);

  const wantsPerfChecks = wantsSearch || wantsArguments; // If the user has not requested they want perf checks, return a nop
  // function.

  if (!wantsPerfChecks) {
    return nop;
  }

  const inputAsVTree =
  /** @type {VTree} */
  input;
  return name => {
    const host =
    /** @type any */
    domNode.host; // Use the Web Component name if it's available.

    if (domNode && host) {
      name = `${host.constructor.name} ${name}`;
    } else if (inputAsVTree && typeof inputAsVTree.rawNodeName === 'function') {
      name = `${inputAsVTree.rawNodeName.name} ${name}`;
    }

    const endName = `${name}-end`;

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    } else {
      const totalMs = (performance.now() - marks.get(name)).toFixed(3);
      marks.delete(name);
      performance.mark(endName);
      performance.measure(`${prefix} ${name} (${totalMs}ms)`, name, endName);
    }
  };
}