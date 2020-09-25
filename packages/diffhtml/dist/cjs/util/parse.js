"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;
exports.TOKEN = void 0;

var _create = _interopRequireDefault(require("../tree/create"));

var _process = _interopRequireDefault(require("./process"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Adapted implementation from:
// https://github.com/ashi009/node-fast-html-parser
// Magic token used for interpolation.
const TOKEN = '__DIFFHTML__';
exports.TOKEN = TOKEN;
const doctypeEx = /<!DOCTYPE.*>/i;
const spaceEx = /[^ ]/;
const tokenEx = new RegExp(`${TOKEN}([^_]*)__`);
/** @type {Supplemental} */

const defaultSupplemental = {
  tags: [],
  attributes: {},
  children: {}
};
const {
  assign
} = Object;
const {
  isArray
} = Array;
const blockTextDefaults = ['script', 'noscript', 'style', 'code', 'template'];
const selfClosingDefaults = ['meta', 'img', 'link', 'input', 'area', 'br', 'hr', 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
/** @type {any} */

const kElementsClosedByOpening = {
  li: {
    li: true
  },
  p: {
    p: true,
    div: true
  },
  td: {
    td: true,
    th: true
  },
  th: {
    td: true,
    th: true
  }
};
/** @type {any} */

const kElementsClosedByClosing = {
  li: {
    ul: true,
    ol: true
  },
  a: {
    div: true
  },
  b: {
    div: true
  },
  i: {
    div: true
  },
  p: {
    div: true
  },
  td: {
    tr: true,
    table: true
  },
  th: {
    tr: true,
    table: true
  }
};
/**
 * Interpolates children from dynamic supplemental values into the parent node.
 *
 * @param {VTree} currentParent - Active element VTree
 * @param {string} markup - Incoming partial HTML markup
 * @param {Supplemental} supplemental - Dynamic interpolated data values
 */

const interpolateChildNodes = (currentParent, markup, supplemental) => {
  if ('childNodes' in currentParent.attributes) {
    return;
  } // If this is text and not a doctype, add as a text node.


  if (markup && !doctypeEx.test(markup) && !tokenEx.test(markup)) {
    return currentParent.childNodes.push(
    /** @type {VTree} */
    (0, _create.default)('#text', markup));
  }

  const childNodes = [];
  const parts = markup.split(tokenEx);

  for (let i = 0; i < parts.length; i++) {
    const value = parts[i];

    if (!value) {
      continue;
    } // When we split on the token expression, the capture group will replace
    // the token's position. So all we do is ensure that we're on an odd
    // index and then we can source the correct value.


    if (i % 2 === 1) {
      const supValue = supplemental.children[value];
      const innerTree = value in supplemental.children ? supValue : (0, _create.default)('#text', `${TOKEN}${value}__`);
      if (!innerTree) continue;
      const isFragment = innerTree.nodeType === 11;

      if (typeof innerTree.rawNodeName === 'string' && isFragment) {
        childNodes.push(...innerTree.childNodes);
      } else {
        childNodes.push(innerTree);
      }
    } else if (!doctypeEx.test(value)) {
      childNodes.push((0, _create.default)('#text', value));
    }
  }

  currentParent.childNodes.push(...childNodes);
};
/**
 * HTMLElement, which contains a set of children.
 *
 * Note: this is a minimalist implementation, no complete tree structure
 * provided (no parentNode, nextSibling, previousSibling etc).
 *
 * @param {String} nodeName - DOM Node name
 * @param {String} rawAttrs - DOM Node Attributes
 * @param {Supplemental} supplemental - Interpolated data from a tagged template
 * @param {Options} options
 * @return {VTree} vTree
 */


const HTMLElement = (nodeName, rawAttrs, supplemental, options) => {
  let match = null;
  const attrEx = /\b([_a-z][_a-z0-9\-:.]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig; // Support dynamic tag names like: `<${MyComponent} />`.

  if (match = tokenEx.exec(nodeName)) {
    return HTMLElement(supplemental.tags[match[1]], rawAttrs, supplemental, options);
  }
  /** @type {{ [key: string]: any }} */


  const attributes = {}; // Migrate raw attributes into the attributes object used by the VTree.

  for (let match; match = attrEx.exec(rawAttrs || _types.EMPTY.STR);) {
    const isHTML = typeof nodeName === 'string';
    const name = match[1];
    const testValue = match[6] || match[5] || match[4];
    const value = testValue || (isHTML ? match[1] : testValue || true);
    let valueMatchesToken = String(value).match(tokenEx); // If we have multiple interpolated values in an attribute, we must
    // flatten to a string. There are no other valid options.

    if (valueMatchesToken && valueMatchesToken.length) {
      const parts = String(value).split(tokenEx);
      const hasToken = tokenEx.exec(name);
      const newName = hasToken ? supplemental.attributes[hasToken[1]] : name;

      for (let i = 0; i < parts.length; i++) {
        const value = parts[i];

        if (!value) {
          continue;
        } // When we split on the token expression, the capture group will
        // replace the token's position. So all we do is ensure that we're on
        // an odd index and then we can source the correct value.


        if (i % 2 === 1) {
          const isObject = typeof newName === 'object';
          const supValue = supplemental.attributes[value];
          const fallback = `${TOKEN}${value}__`; // Allow interpolating multiple values into a single attribute.

          if (attributes[newName]) {
            attributes[newName] += value in supplemental.attributes ? supValue : fallback;
          } // Merge object attributes directly into the existing attributes.
          else if (isObject) {
              if (newName && !isArray(newName)) {
                assign(attributes, newName);
              } else {
                if (_process.default.env.NODE_ENV !== 'production') {
                  throw new Error('Arrays cannot be spread as attributes');
                }
              }
            } else if (newName) {
              attributes[newName] = value in supplemental.attributes ? supValue : fallback;
            }
        } // Otherwise this is a static iteration, simply concat the raw value into the attribute.
        else if (attributes[newName]) {
            attributes[newName] += value;
          } // Set the initial attribute value.
          else {
              attributes[newName] = value;
            }
      }
    } // If the name was injected, pull from attributes and assign as either
    // empty or truthy.
    else if (valueMatchesToken = tokenEx.exec(name)) {
        const nameAndValue = supplemental.attributes[valueMatchesToken[1]];

        if (typeof nameAndValue === 'object' && !isArray(nameAndValue)) {
          assign(attributes, nameAndValue);
        } else {
          attributes[nameAndValue] = _types.EMPTY.STR;
        }
      } // If the remaining value is a string, directly assign to the attribute
      // name. If the value is anything else, treat it as unknown and default to
      // a boolean.
      else {
          attributes[name] = value === `''` || value === `""` ? _types.EMPTY.STR : value;
        }
  }

  return (0, _create.default)(nodeName, attributes, attributes.childNodes || []);
};
/**
 * Parses HTML and returns a root element
 *
 * @param {String} html - String of HTML markup to parse into a Virtual Tree
 * @param {Supplemental=} supplemental - Dynamic interpolated data values
 * @param {Options=} options - Contains options like silencing warnings
 * @return {VTree} - Parsed Virtual Tree Element
 */


function parse(html, supplemental, options = {}) {
  if (!options.parser) {
    /** @type {ParserOptions} */
    options.parser = {};
  }

  if (!supplemental) {
    supplemental = defaultSupplemental;
  }

  const blockText = new Set(options.parser.rawElements ? options.parser.rawElements : blockTextDefaults);
  const selfClosing = new Set(options.parser.selfClosingElements || selfClosingDefaults);
  const tagEx = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;
  const root = (0, _create.default)('#document-fragment', null, []);
  const stack = [root];
  let currentParent = root;
  let lastTextPos = -1;

  if (_process.default.env.NODE_ENV !== 'production') {
    const markup = [html];

    if (!html.includes('<') && options.parser.strict) {
      markup.splice(1, 0, `
Possibly invalid markup. Opening tag was not properly opened.
      `);
      throw new Error(`\n\n${markup.join('\n')}`);
    }

    if (!html.includes('>') && options.parser.strict) {
      markup.splice(1, 0, `
Possibly invalid markup. Opening tag was not properly closed.
      `);
      throw new Error(`\n\n${markup.join('\n')}`);
    }
  } // If there are no HTML elements, treat the passed in html as a single
  // text node.


  if (!html.includes('<') && html) {
    interpolateChildNodes(currentParent, html, supplemental);
    return root;
  } // Look through the HTML markup for valid tags.


  for (let match, text, i = 0; match = tagEx.exec(html); i++) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        text = html.slice(lastTextPos, tagEx.lastIndex - match[0].length);

        if (text) {
          interpolateChildNodes(currentParent, text, supplemental);
        }
      }
    }

    const matchOffset = tagEx.lastIndex - match[0].length;

    if (lastTextPos === -1 && matchOffset > 0) {
      const string = html.slice(0, matchOffset);

      if (string && !doctypeEx.exec(string)) {
        interpolateChildNodes(currentParent, string, supplemental);
      }
    }

    lastTextPos = tagEx.lastIndex; // This is a comment (TODO support these).

    if (match[0][1] === '!') {
      continue;
    } // Get the tag index.


    const tokenMatch = tokenEx.exec(match[2]); // Normalized name, use either the tag extracted from the supplemental
    // tags, or use match[2].

    const supTag = tokenMatch && supplemental.tags[tokenMatch[1]];
    const name = supTag ? supTag.name || supTag : match[2];

    if (!match[1]) {
      // not </ tags
      if (!match[4] && kElementsClosedByOpening[currentParent.rawNodeName]) {
        if (kElementsClosedByOpening[currentParent.rawNodeName][name]) {
          stack.pop();
          currentParent = stack[stack.length - 1];
        }
      }

      currentParent = currentParent.childNodes[currentParent.childNodes.push(HTMLElement(match[2], match[3], supplemental, options)) - 1];
      stack.push(currentParent);

      if (options.parser.strict || blockText.has(name)) {
        // A little test to find next </script> or </style> ...
        const closeMarkup = `</${name}>`;
        const index = html.indexOf(closeMarkup, tagEx.lastIndex);

        if (_process.default.env.NODE_ENV !== 'production') {
          if (index === -1 && options.parser.strict && !selfClosing.has(name)) {
            // Find a subset of the markup passed in to validate.
            const markup = html.slice(tagEx.lastIndex - match[0].length).split('\n').map(line => line.replace(tokenEx, (value, index) => {
              if (!supplemental) {
                return value;
              }

              const {
                tags,
                children,
                attributes
              } = supplemental;
              return tags[index] || children[index] || attributes[index];
            })).slice(0, 3); // Position the caret next to the first non-whitespace character.

            const lookup = spaceEx.exec(markup[0]);
            const caret = Array((lookup ? lookup.index - 1 : 0) + closeMarkup.length - 1).join(' ') + '^'; // Craft the warning message and inject it into the markup.

            markup.splice(1, 0, `${caret}
    Possibly invalid markup. <${name}> must be closed in strict mode.
            `); // Throw an error message if the markup isn't what we expected.

            throw new Error(`\n\n${markup.join('\n')}`);
          }
        }

        if (blockText.has(name)) {
          if (index === -1) {
            lastTextPos = tagEx.lastIndex = html.length + 1;
          } else {
            lastTextPos = index + closeMarkup.length;
            tagEx.lastIndex = lastTextPos;
            match[1] = ' ';
          }

          const newText = html.slice(match.index + match[0].length, index);
          interpolateChildNodes(currentParent, newText, supplemental);
        }
      }
    }

    if (match[1] || match[4] || selfClosing.has(name)) {
      if (_process.default.env.NODE_ENV !== 'production') {
        if (currentParent && name !== currentParent.rawNodeName && options.parser.strict) {
          const nodeName = currentParent.rawNodeName; // Find a subset of the markup passed in to validate.

          const markup = html.slice(tagEx.lastIndex - match[0].length).split('\n').map(line => line.replace(tokenEx, (value, index) => {
            if (!supplemental) {
              return value;
            }

            const {
              tags,
              children,
              attributes
            } = supplemental;
            return tags[index] || children[index] || attributes[index];
          })).slice(0, 3); // Position the caret next to the first non-whitespace character.

          const lookup = spaceEx.exec(markup[0]);
          const caret = Array(lookup ? lookup.index : 0).join(' ') + '^'; // Craft the warning message and inject it into the markup.

          markup.splice(1, 0, `${caret}
  Possibly invalid markup. Saw ${name}, expected ${nodeName}...
          `); // Throw an error message if the markup isn't what we expected.

          throw new Error(`\n\n${markup.join('\n')}`);
        }
      } // </ or /> or <br> etc.


      while (currentParent) {
        // Self closing dynamic nodeName.
        if (match[4] === '/' && tokenMatch) {
          stack.pop();
          currentParent = stack[stack.length - 1];
          break;
        } // Not self-closing, so seek out the next match.
        else if (supTag) {
            if (currentParent.rawNodeName === name) {
              stack.pop();
              currentParent = stack[stack.length - 1];
              break;
            }
          }

        if (currentParent.rawNodeName === name) {
          stack.pop();
          currentParent = stack[stack.length - 1];
          break;
        } else {
          const tag = kElementsClosedByClosing[currentParent.rawNodeName]; // Trying to close current tag, and move on

          if (tag) {
            if (tag[name]) {
              stack.pop();
              currentParent = stack[stack.length - 1];
              continue;
            }
          } // Use aggressive strategy to handle unmatching markups.


          break;
        }
      }
    }
  } // Find any last remaining text after the parsing completes over tags.


  const remainingText = html.slice(lastTextPos === -1 ? 0 : lastTextPos);

  if (_process.default.env.NODE_ENV !== 'production') {
    if ((remainingText.includes('>') || remainingText.includes('<')) && options.parser.strict) {
      // Find a subset of the markup passed in to validate.
      const markup = [remainingText]; // Position the caret next to the first non-whitespace character.

      const lookup = spaceEx.exec(markup[0]);
      const caret = Array(lookup ? lookup.index : 0).join(' ') + '^'; // Craft the warning message and inject it into the markup.

      if (remainingText.includes('>')) {
        markup.splice(1, 0, `${caret}
  Possibly invalid markup. Opening tag was not properly opened.
        `);
      } else {
        markup.splice(1, 0, `${caret}
  Possibly invalid markup. Opening tag was not properly closed.
        `);
      } // Throw an error message if the markup isn't what we expected.


      throw new Error(`\n\n${markup.join('\n')}`);
    }
  } // Ensure that all values are properly interpolated through the remaining
  // markup after parsing.


  if (remainingText) {
    interpolateChildNodes(currentParent, remainingText, supplemental);
  } // This is an entire document, so only allow the HTML children to be
  // body or head.


  if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
    // Store elements from before body end and after body end.

    /** @type {{ [name: string]: VTree[] }} */
    const head = {
      before: [],
      after: []
    };
    /** @type {{ [name: string]: VTree[] }} */

    const body = {
      after: []
    };
    const HTML = root.childNodes[0];
    let beforeHead = true;
    let beforeBody = true; // Iterate the children and store elements in the proper array for
    // later concat, replace the current childNodes with this new array.

    HTML.childNodes = HTML.childNodes.filter(el => {
      // If either body or head, allow as a valid element.
      if (el.nodeName === 'body' || el.nodeName === 'head') {
        if (el.nodeName === 'head') beforeHead = false;
        if (el.nodeName === 'body') beforeBody = false;
        return true;
      } // Not a valid nested HTML tag element, move to respective container.
      else if (el.nodeType === 1) {
          if (beforeHead && beforeBody) head.before.push(el);else if (!beforeHead && beforeBody) head.after.push(el);else if (!beforeBody) body.after.push(el);
        }
    }); // Ensure the first element is the HEAD tag.

    if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
      const headInstance = (0, _create.default)('head', null, []);

      if (headInstance) {
        const existing = headInstance.childNodes;
        existing.unshift.apply(existing, head.before);
        existing.push.apply(existing, head.after);
        HTML.childNodes.unshift(headInstance);
      }
    } else {
      const existing = HTML.childNodes[0].childNodes;
      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
    } // Ensure the second element is the body tag.


    if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
      const bodyInstance = (0, _create.default)('body', null, []);

      if (bodyInstance) {
        const existing = bodyInstance.childNodes;
        existing.push.apply(existing, body.after);
        HTML.childNodes.push(bodyInstance);
      }
    } else {
      const existing = HTML.childNodes[1].childNodes;
      existing.push.apply(existing, body.after);
    }
  }

  return root;
}