(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.diff = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var EMPTY = {
    STR: '',
    NUM: 1,
    OBJ: {},
    ARR: [],
    FUNC: function () {},
    MAP: new Map(),
    SET: new Set(),
    DOM: {}
  };
  var PATCH_TYPE = {
    'SET_ATTRIBUTE': 0,
    'REMOVE_ATTRIBUTE': 1,
    'NODE_VALUE': 2,
    'INSERT_BEFORE': 3,
    'REPLACE_CHILD': 4,
    'REMOVE_CHILD': 5
  };
  var TransitionStateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];
  var StateCache = new Map();
  var NodeCache = new Map();
  var TransitionCache = new Map([['attached', new Set()], ['detached', new Set()], ['replaced', new Set()], ['attributeChanged', new Set()], ['textChanged', new Set()]]);
  var MiddlewareCache = new Set();
  var CreateTreeHookCache = new Set();
  var CreateNodeHookCache = new Set();
  var SyncTreeHookCache = new Set();
  var ReleaseHookCache = new Set();
  var ParseHookCache = new Set();



  var caches = /*#__PURE__*/Object.freeze({
    __proto__: null,
    StateCache: StateCache,
    NodeCache: NodeCache,
    TransitionCache: TransitionCache,
    MiddlewareCache: MiddlewareCache,
    CreateTreeHookCache: CreateTreeHookCache,
    CreateNodeHookCache: CreateNodeHookCache,
    SyncTreeHookCache: SyncTreeHookCache,
    ReleaseHookCache: ReleaseHookCache,
    ParseHookCache: ParseHookCache
  });

  var size = 10000;
  var free = new Set();
  var allocate = new Set();
  var protect = new Set();

  var shape = function () {
    return {
      rawNodeName: EMPTY.STR,
      nodeName: EMPTY.STR,
      nodeValue: EMPTY.STR,
      nodeType: 1,
      key: EMPTY.STR,
      childNodes: [],
      attributes: {}
    };
  };

  var memory = {
    free: free,
    allocated: allocate,
    protected: protect
  };
  var freeValues = free.values();
  var Pool = {
    size: size,
    memory: memory,
    fill: function () {
      var _this = this;

      for (var i = free.size; i < this.size; i++) {
        free.add(shape());
      }

      if (this.size < free.size) {
        free.forEach(function (value) {
          if (free.size !== _this.size) {
            free.delete(value);
          }
        });
      }
    },
    get: function () {
      var _freeValues$next = freeValues.next(),
          _freeValues$next$valu = _freeValues$next.value,
          value = _freeValues$next$valu === void 0 ? shape() : _freeValues$next$valu,
          done = _freeValues$next.done;

      if (done) {
        freeValues = free.values();
      }

      free.delete(value);
      allocate.add(value);
      return value;
    },
    protect: function (vTree) {
      allocate.delete(vTree);
      protect.add(vTree);
    },
    unprotect: function (vTree) {
      if (protect.has(vTree)) {
        protect.delete(vTree);
        free.add(vTree);
      } else if (allocate.has(vTree)) {
        allocate.delete(vTree);
        free.add(vTree);
      }
    }
  };
  Pool.fill();

  var isArray = Array.isArray;
  var memory$1 = Pool.memory;
  var fragmentName = '#document-fragment';
  var textName = '#text';
  function createTree(input, attributes, childNodes) {
    var entry = null;

    if (memory$1.protected.has(input) || memory$1.allocated.has(input)) {
      entry = input;
    } else if (!input || isArray(input)) {
        var length = input ? input.length : 0;
        childNodes = [];

        for (var i = 0; i < length; i++) {
          if (!input) continue;
          childNodes.push(input[i]);
        }

        entry = createTree(fragmentName, null, childNodes);
      }

    if (entry) {
      return entry;
    }

    var isObject = typeof input === 'object';
    var inputAsHTMLEl = input;

    if (input && isObject && 'ownerDocument' in inputAsHTMLEl) {
      var _entry$childNodes;

      var nodeType = inputAsHTMLEl.nodeType;

      if (nodeType === 3) {
        var vTree = createTree(textName, inputAsHTMLEl.nodeValue);
        NodeCache.set(vTree, inputAsHTMLEl);
        return vTree;
      }

      attributes = {};
      childNodes = [];
      var inputAttrs = inputAsHTMLEl.attributes;

      if (inputAsHTMLEl.nodeType === 1 && inputAttrs && inputAttrs.length) {
        for (var _i = 0; _i < inputAttrs.length; _i++) {
          var _inputAttrs$_i = inputAttrs[_i],
              name = _inputAttrs$_i.name,
              value = _inputAttrs$_i.value;

          if (value === EMPTY.STR && name in inputAsHTMLEl) {
            attributes[name] = input[name];
            continue;
          }

          attributes[name] = value;
        }
      }

      if (inputAsHTMLEl.nodeType === 1 || inputAsHTMLEl.nodeType === 11) {
        if (inputAsHTMLEl.childNodes.length) {
          childNodes = [];

          for (var _i2 = 0; _i2 < inputAsHTMLEl.childNodes.length; _i2++) {
            var childNodeElement = inputAsHTMLEl.childNodes[_i2];
            childNodes.push(createTree(childNodeElement));
          }
        }
      }

      NodeCache.forEach(function (node, vTree) {
        if (node === input) {
          entry = vTree;
        }
      });
      entry = entry || createTree(inputAsHTMLEl.nodeName, attributes, childNodes);
      entry.attributes = attributes;
      entry.childNodes.length = 0;

      (_entry$childNodes = entry.childNodes).push.apply(_entry$childNodes, _toConsumableArray(childNodes));

      NodeCache.set(entry, inputAsHTMLEl);
      return entry;
    }

    if (isObject) {
      var rawNodeName = input.rawNodeName,
          nodeName = input.nodeName,
          nodeValue = input.nodeValue,
          _attributes = input.attributes,
          _childNodes = input.childNodes,
          children = input.children;
      var treeName = rawNodeName || nodeName;

      var _vTree = createTree(treeName, _attributes || null, children || _childNodes);

      if (nodeValue) {
        _vTree.nodeValue = nodeValue;
      }

      return _vTree;
    }

    for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    if (rest.length) {
      childNodes = [childNodes].concat(rest);
    }

    entry = Pool.get();
    var isTextNode = input === textName;
    var isString = typeof input === 'string';

    if (isString) {
      entry.rawNodeName = input;
      entry.nodeName = entry.rawNodeName.toLowerCase();
    } else {
        entry.rawNodeName = input;
        entry.nodeName = fragmentName;
      }

    entry.nodeValue = EMPTY.STR;
    entry.key = EMPTY.STR;
    entry.childNodes.length = 0;
    entry.attributes = {};
    var useAttributes = isArray(attributes) || typeof attributes !== 'object';
    var useNodes = useAttributes ? attributes : childNodes;
    var allNodes = isArray(useNodes) ? useNodes : [useNodes];

    if (isTextNode) {
      var _nodeValue = allNodes.join(EMPTY.STR);

      entry.nodeType = 3;
      entry.nodeValue = String(_nodeValue || EMPTY.STR);
      return entry;
    } else if (entry.nodeName === fragmentName) {
      entry.nodeType = 11;
    } else if (input === '#comment') {
      entry.nodeType = 8;
    } else {
      entry.nodeType = 1;
    }

    if (useNodes && allNodes.length) {
      for (var _i3 = 0; _i3 < allNodes.length; _i3++) {
        var newNode = allNodes[_i3];

        if (isArray(newNode)) {
          var _entry$childNodes2;

          (_entry$childNodes2 = entry.childNodes).push.apply(_entry$childNodes2, _toConsumableArray(newNode));
        } else if (!newNode) {
            continue;
          } else if (newNode.nodeType === 11 && typeof newNode.rawNodeName === 'string') {
              var _entry$childNodes3;

              (_entry$childNodes3 = entry.childNodes).push.apply(_entry$childNodes3, _toConsumableArray(newNode.childNodes));
            } else if (newNode && typeof newNode === 'object') {
                entry.childNodes.push(createTree(newNode));
              } else {
                  entry.childNodes.push(createTree(textName, null, newNode));
                }
      }
    }

    if (attributes && typeof attributes === 'object' && !isArray(attributes)) {
      entry.attributes = attributes;
    }

    if (entry.nodeName === 'script' && entry.attributes.src) {
      entry.key = String(entry.attributes.src);
    }

    if (entry.attributes && 'key' in entry.attributes) {
      entry.key = String(entry.attributes.key);
    }

    if (CreateTreeHookCache.size) {
      CreateTreeHookCache.forEach(function (fn, retVal) {
        if (retVal = fn(entry)) {
          entry = createTree(retVal);
        }
      });
    }

    return entry;
  }

  var process$1 = typeof process !== 'undefined' ? process : {
    env: {
      NODE_ENV: 'development'
    },
    argv: []
  };

  var TOKEN = '__DIFFHTML__';
  var doctypeEx = /<!DOCTYPE.*>/i;
  var spaceEx = /[^ ]/;
  var tokenEx = new RegExp("".concat(TOKEN, "([^_]*)__"));
  var defaultSupplemental = {
    tags: [],
    attributes: {},
    children: {}
  };
  var assign = Object.assign;
  var isArray$1 = Array.isArray;
  var blockTextDefaults = ['script', 'noscript', 'style', 'code', 'template'];
  var selfClosingDefaults = ['meta', 'img', 'link', 'input', 'area', 'br', 'hr', 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
  var kElementsClosedByOpening = {
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
  var kElementsClosedByClosing = {
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

  var interpolateChildNodes = function (currentParent, markup, supplemental) {
    var _currentParent$childN;

    if ('childNodes' in currentParent.attributes) {
      return;
    }

    if (markup && !doctypeEx.test(markup) && !tokenEx.test(markup)) {
      return currentParent.childNodes.push(createTree('#text', markup));
    }

    var childNodes = [];
    var parts = markup.split(tokenEx);

    for (var i = 0; i < parts.length; i++) {
      var value = parts[i];

      if (!value) {
        continue;
      }

      if (i % 2 === 1) {
        var supValue = supplemental.children[value];
        var innerTree = value in supplemental.children ? supValue : createTree('#text', "".concat(TOKEN).concat(value, "__"));
        if (!innerTree) continue;
        var isFragment = innerTree.nodeType === 11;

        if (typeof innerTree.rawNodeName === 'string' && isFragment) {
          childNodes.push.apply(childNodes, _toConsumableArray(innerTree.childNodes));
        } else {
          childNodes.push(innerTree);
        }
      } else if (!doctypeEx.test(value)) {
        childNodes.push(createTree('#text', value));
      }
    }

    (_currentParent$childN = currentParent.childNodes).push.apply(_currentParent$childN, childNodes);
  };

  var HTMLElement = function (nodeName, rawAttrs, supplemental, options) {
    var match = null;
    var attrEx = /\b([_a-z][_a-z0-9\-:.]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;

    if (match = tokenEx.exec(nodeName)) {
      return HTMLElement(supplemental.tags[match[1]], rawAttrs, supplemental);
    }

    var attributes = {};

    for (var _match; _match = attrEx.exec(rawAttrs || EMPTY.STR);) {
      var isHTML = typeof nodeName === 'string';
      var name = _match[1];
      var testValue = _match[6] || _match[5] || _match[4];
      var value = testValue || (isHTML ? _match[1] : testValue || true);
      var valueMatchesToken = String(value).match(tokenEx);

      if (valueMatchesToken && valueMatchesToken.length) {
        var parts = String(value).split(tokenEx);
        var hasToken = tokenEx.exec(name);
        var newName = hasToken ? supplemental.attributes[hasToken[1]] : name;

        for (var i = 0; i < parts.length; i++) {
          var _value = parts[i];

          if (!_value) {
            continue;
          }

          if (i % 2 === 1) {
            var isObject = typeof newName === 'object';
            var supValue = supplemental.attributes[_value];
            var fallback = "".concat(TOKEN).concat(_value, "__");

            if (attributes[newName]) {
              attributes[newName] += _value in supplemental.attributes ? supValue : fallback;
            } else if (isObject) {
                if (newName && !isArray$1(newName)) {
                  assign(attributes, newName);
                } else {
                  if (process$1.env.NODE_ENV !== 'production') {
                    throw new Error('Arrays cannot be spread as attributes');
                  }
                }
              } else if (newName) {
                attributes[newName] = _value in supplemental.attributes ? supValue : fallback;
              }
          } else if (attributes[newName]) {
              attributes[newName] += _value;
            } else {
                attributes[newName] = _value;
              }
        }
      } else if (valueMatchesToken = tokenEx.exec(name)) {
          var nameAndValue = supplemental.attributes[valueMatchesToken[1]];

          if (typeof nameAndValue === 'object' && !isArray$1(nameAndValue)) {
            assign(attributes, nameAndValue);
          } else {
            attributes[nameAndValue] = EMPTY.STR;
          }
        } else {
            attributes[name] = value === "''" || value === "\"\"" ? EMPTY.STR : value;
          }
    }

    return createTree(nodeName, attributes, attributes.childNodes || []);
  };

  function parse(html, supplemental) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!options.parser) {
      options.parser = {};
    }

    if (!supplemental) {
      supplemental = defaultSupplemental;
    }

    var blockText = new Set(options.parser.rawElements ? options.parser.rawElements : blockTextDefaults);
    var selfClosing = new Set(options.parser.selfClosingElements || selfClosingDefaults);
    var tagEx = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;
    var root = createTree('#document-fragment', null, []);
    var stack = [root];
    var currentParent = root;
    var lastTextPos = -1;

    if (process$1.env.NODE_ENV !== 'production') {
      var markup = [html];

      if (!html.includes('<') && options.parser.strict) {
        markup.splice(1, 0, "\nPossibly invalid markup. Opening tag was not properly opened.\n      ");
        throw new Error("\n\n".concat(markup.join('\n')));
      }

      if (!html.includes('>') && options.parser.strict) {
        markup.splice(1, 0, "\nPossibly invalid markup. Opening tag was not properly closed.\n      ");
        throw new Error("\n\n".concat(markup.join('\n')));
      }
    }

    if (!html.includes('<') && html) {
      interpolateChildNodes(currentParent, html, supplemental);
      return root;
    }

    for (var match, text, i = 0; match = tagEx.exec(html); i++) {
      if (lastTextPos > -1) {
        if (lastTextPos + match[0].length < tagEx.lastIndex) {
          text = html.slice(lastTextPos, tagEx.lastIndex - match[0].length);

          if (text) {
            interpolateChildNodes(currentParent, text, supplemental);
          }
        }
      }

      var matchOffset = tagEx.lastIndex - match[0].length;

      if (lastTextPos === -1 && matchOffset > 0) {
        var string = html.slice(0, matchOffset);

        if (string && !doctypeEx.exec(string)) {
          interpolateChildNodes(currentParent, string, supplemental);
        }
      }

      lastTextPos = tagEx.lastIndex;

      if (match[0][1] === '!') {
        continue;
      }

      var tokenMatch = tokenEx.exec(match[2]);
      var supTag = tokenMatch && supplemental.tags[tokenMatch[1]];
      var name = supTag ? supTag.name || supTag : match[2];

      if (!match[1]) {
        if (!match[4] && kElementsClosedByOpening[currentParent.rawNodeName]) {
          if (kElementsClosedByOpening[currentParent.rawNodeName][name]) {
            stack.pop();
            currentParent = stack[stack.length - 1];
          }
        }

        currentParent = currentParent.childNodes[currentParent.childNodes.push(HTMLElement(match[2], match[3], supplemental)) - 1];
        stack.push(currentParent);

        if (options.parser.strict || blockText.has(name)) {
          var closeMarkup = "</".concat(name, ">");
          var index = html.indexOf(closeMarkup, tagEx.lastIndex);

          if (process$1.env.NODE_ENV !== 'production') {
            if (index === -1 && options.parser.strict && !selfClosing.has(name)) {
              var _markup = html.slice(tagEx.lastIndex - match[0].length).split('\n').map(function (line) {
                return line.replace(tokenEx, function (value, index) {
                  if (!supplemental) {
                    return value;
                  }

                  var _supplemental = supplemental,
                      tags = _supplemental.tags,
                      children = _supplemental.children,
                      attributes = _supplemental.attributes;
                  return tags[index] || children[index] || attributes[index];
                });
              }).slice(0, 3);

              var lookup = spaceEx.exec(_markup[0]);
              var caret = Array((lookup ? lookup.index - 1 : 0) + closeMarkup.length - 1).join(' ') + '^';

              _markup.splice(1, 0, "".concat(caret, "\n    Possibly invalid markup. <").concat(name, "> must be closed in strict mode.\n            "));

              throw new Error("\n\n".concat(_markup.join('\n')));
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

            var newText = html.slice(match.index + match[0].length, index);
            interpolateChildNodes(currentParent, newText, supplemental);
          }
        }
      }

      if (match[1] || match[4] || selfClosing.has(name)) {
        if (process$1.env.NODE_ENV !== 'production') {
          if (currentParent && name !== currentParent.rawNodeName && options.parser.strict) {
            var nodeName = currentParent.rawNodeName;

            var _markup2 = html.slice(tagEx.lastIndex - match[0].length).split('\n').map(function (line) {
              return line.replace(tokenEx, function (value, index) {
                if (!supplemental) {
                  return value;
                }

                var _supplemental2 = supplemental,
                    tags = _supplemental2.tags,
                    children = _supplemental2.children,
                    attributes = _supplemental2.attributes;
                return tags[index] || children[index] || attributes[index];
              });
            }).slice(0, 3);

            var _lookup = spaceEx.exec(_markup2[0]);

            var _caret = Array(_lookup ? _lookup.index : 0).join(' ') + '^';

            _markup2.splice(1, 0, "".concat(_caret, "\n  Possibly invalid markup. Saw ").concat(name, ", expected ").concat(nodeName, "...\n          "));

            throw new Error("\n\n".concat(_markup2.join('\n')));
          }
        }

        while (currentParent) {
          if (match[4] === '/' && tokenMatch) {
            stack.pop();
            currentParent = stack[stack.length - 1];
            break;
          } else if (supTag) {
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
            var tag = kElementsClosedByClosing[currentParent.rawNodeName];

            if (tag) {
              if (tag[name]) {
                stack.pop();
                currentParent = stack[stack.length - 1];
                continue;
              }
            }

            break;
          }
        }
      }
    }

    var remainingText = html.slice(lastTextPos === -1 ? 0 : lastTextPos);

    if (process$1.env.NODE_ENV !== 'production') {
      if ((remainingText.includes('>') || remainingText.includes('<')) && options.parser.strict) {
        var _markup3 = [remainingText];

        var _lookup2 = spaceEx.exec(_markup3[0]);

        var _caret2 = Array(_lookup2 ? _lookup2.index : 0).join(' ') + '^';

        if (remainingText.includes('>')) {
          _markup3.splice(1, 0, "".concat(_caret2, "\n  Possibly invalid markup. Opening tag was not properly opened.\n        "));
        } else {
          _markup3.splice(1, 0, "".concat(_caret2, "\n  Possibly invalid markup. Opening tag was not properly closed.\n        "));
        }

        throw new Error("\n\n".concat(_markup3.join('\n')));
      }
    }

    if (remainingText) {
      interpolateChildNodes(currentParent, remainingText, supplemental);
    }

    if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
      var head = {
        before: [],
        after: []
      };
      var body = {
        after: []
      };
      var HTML = root.childNodes[0];
      var beforeHead = true;
      var beforeBody = true;
      HTML.childNodes = HTML.childNodes.filter(function (el) {
        if (el.nodeName === 'body' || el.nodeName === 'head') {
          if (el.nodeName === 'head') beforeHead = false;
          if (el.nodeName === 'body') beforeBody = false;
          return true;
        } else if (el.nodeType === 1) {
            if (beforeHead && beforeBody) head.before.push(el);else if (!beforeHead && beforeBody) head.after.push(el);else if (!beforeBody) body.after.push(el);
          }
      });

      if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
        var headInstance = createTree('head', null, []);

        if (headInstance) {
          var existing = headInstance.childNodes;
          existing.unshift.apply(existing, head.before);
          existing.push.apply(existing, head.after);
          HTML.childNodes.unshift(headInstance);
        }
      } else {
        var _existing = HTML.childNodes[0].childNodes;

        _existing.unshift.apply(_existing, head.before);

        _existing.push.apply(_existing, head.after);
      }

      if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
        var bodyInstance = createTree('body', null, []);

        if (bodyInstance) {
          var _existing2 = bodyInstance.childNodes;

          _existing2.push.apply(_existing2, body.after);

          HTML.childNodes.push(bodyInstance);
        }
      } else {
        var _existing3 = HTML.childNodes[1].childNodes;

        _existing3.push.apply(_existing3, body.after);
      }
    }

    return root;
  }

  var protect$1 = Pool.protect,
      unprotect = Pool.unprotect,
      memory$2 = Pool.memory;
  function protectVTree(vTree) {
    protect$1(vTree);

    for (var i = 0; i < vTree.childNodes.length; i++) {
      protectVTree(vTree.childNodes[i]);
    }

    return vTree;
  }
  function unprotectVTree(vTree) {
    unprotect(vTree);

    for (var i = 0; i < vTree.childNodes.length; i++) {
      unprotectVTree(vTree.childNodes[i]);
    }

    NodeCache.delete(vTree);
    return vTree;
  }
  function gc() {
    memory$2.allocated.forEach(function (vTree) {
      memory$2.free.add(vTree);
      memory$2.allocated.delete(vTree);
      NodeCache.delete(vTree);
    });
  }

  var memory$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    protectVTree: protectVTree,
    unprotectVTree: unprotectVTree,
    gc: gc
  });

  var marks = new Map();
  var prefix = 'diffHTML';
  var DIFF_PERF = 'diff_perf';
  var hasSearch = typeof location !== 'undefined';
  var hasArguments = process$1.argv;

  var nop = function () {};

  function makeMeasure(domNode, input) {
    var wantsSearch = hasSearch && location.search.includes(DIFF_PERF);
    var wantsArguments = hasArguments && process$1.argv.includes(DIFF_PERF);
    var wantsPerfChecks = wantsSearch || wantsArguments;

    if (!wantsPerfChecks) {
      return nop;
    }

    var inputAsVTree = input;
    return function (name) {
      var host = domNode.host;

      if (domNode && host) {
        name = "".concat(host.constructor.name, " ").concat(name);
      } else if (inputAsVTree && typeof inputAsVTree.rawNodeName === 'function') {
        name = "".concat(inputAsVTree.rawNodeName.name, " ").concat(name);
      }

      var endName = "".concat(name, "-end");

      if (!marks.has(name)) {
        marks.set(name, performance.now());
        performance.mark(name);
      } else {
        var totalMs = (performance.now() - marks.get(name)).toFixed(3);
        marks.delete(name);
        performance.mark(endName);
        performance.measure("".concat(prefix, " ").concat(name, " (").concat(totalMs, "ms)"), name, endName);
      }
    };
  }

  function schedule(transaction) {
    var state = transaction.state;
    var isRendering = state.isRendering;
    StateCache.forEach(function (val) {
      var domNode = val.activeTransaction && val.activeTransaction.domNode;
      var newNode = transaction.domNode;

      if (!domNode || !domNode.contains || !newNode || !newNode.contains) {
        return;
      }

      if (domNode.contains(newNode) && val.isRendering) {
        state = val;
        isRendering = true;
      } else if (newNode.contains(domNode) && val.isRendering) {
        state = val;
        isRendering = true;
      }
    });
    var _state = state,
        activeTransaction = _state.activeTransaction,
        nextTransaction = _state.nextTransaction;

    if (isRendering) {
      var tasks = transaction.tasks;
      var chainTransaction = nextTransaction || activeTransaction;
      state.nextTransaction = transaction;
      transaction.abort();
      var promise = chainTransaction.promise || Promise.resolve();
      return transaction.promise = promise.then(function () {
        transaction.aborted = false;
        transaction.state.isRendering = true;
        transaction.state.activeTransaction = transaction;
        return Transaction.flow(transaction, tasks.slice(1));
      });
    }

    state.isRendering = true;
    state.activeTransaction = transaction;
  }

  function shouldUpdate(transaction) {
    var domNode = transaction.domNode,
        markup = transaction.markup,
        state = transaction.state,
        measure = transaction.state.measure,
        options = transaction.options;
    var prop = options.inner ? 'innerHTML' : 'outerHTML';
    measure('should update');
    var domNodeAsEl = domNode;

    if (typeof markup === 'string' && domNodeAsEl[prop] === markup) {
      return transaction.abort(true);
    } else if (typeof markup === 'string') {
      state.markup = markup;
    }

    measure('should update');
  }

  function release(domNode) {
    var state = StateCache.get(domNode);

    if (state) {
      StateCache.delete(domNode);

      if (state.oldTree && !NodeCache.has(state.oldTree)) {
        unprotectVTree(state.oldTree);
        ReleaseHookCache.forEach(function (fn) {
          return fn(state.oldTree);
        });
      }
    }

    if (!domNode) {
      return;
    }

    var asHTMLElement = domNode;

    if (asHTMLElement.childNodes && asHTMLElement.childNodes.length) {
      for (var i = 0; i < asHTMLElement.childNodes.length; i++) {
        release(asHTMLElement.childNodes[i]);
      }
    }

    if (asHTMLElement.shadowRoot) {
      release(asHTMLElement.shadowRoot);
    }

    NodeCache.forEach(function (domNode, vTree) {
      if (domNode === asHTMLElement) {
        unprotectVTree(vTree);
        ReleaseHookCache.forEach(function (fn) {
          return fn(vTree);
        });
      }
    });
  }

  function reconcileTrees(transaction) {
    var state = transaction.state,
        domNode = transaction.domNode,
        markup = transaction.markup,
        options = transaction.options;
    var previousMarkup = state.previousMarkup;
    var inner = options.inner;
    var domNodeAsHTMLEl = domNode;
    var outerHTML = domNodeAsHTMLEl.outerHTML;

    if (previousMarkup !== outerHTML || !state.oldTree || !outerHTML) {
      release(domNode);
      state.oldTree = createTree(domNodeAsHTMLEl);
      protectVTree(state.oldTree);
      StateCache.set(domNode, state);
    }

    if (!transaction.newTree) {
      transaction.newTree = createTree(markup);
    }

    transaction.oldTree = state.oldTree;
    var oldTree = transaction.oldTree,
        newTree = transaction.newTree;

    if (inner && oldTree && newTree) {
      var nodeName = oldTree.nodeName,
          attributes = oldTree.attributes;
      var isUnknown = typeof newTree.rawNodeName !== 'string';
      var isFragment = newTree.nodeType === 11;
      var children = isFragment && !isUnknown ? newTree.childNodes : newTree;
      transaction.newTree = createTree(nodeName, attributes, children);
    }
  }

  var max = Math.max;
  var keyNames = ['old', 'new'];
  var textName$1 = '#text';
  function syncTree(oldTree, newTree) {
    var patches = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var attributesOnly = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    if (!oldTree) oldTree = EMPTY.OBJ;
    if (!newTree) newTree = EMPTY.OBJ;
    var _state$svgElements = state.svgElements,
        svgElements = _state$svgElements === void 0 ? new Set() : _state$svgElements;
    var oldNodeName = oldTree.nodeName;
    var newNodeName = newTree.nodeName;
    var isEmpty = oldTree === EMPTY.OBJ || attributesOnly;
    var isSVG = newNodeName === 'svg' || svgElements.has(newTree);
    var shortCircuit = null;

    if (SyncTreeHookCache.size) {
      SyncTreeHookCache.forEach(function (fn) {
        var entry = fn(oldTree, newTree);

        if (entry && entry === oldTree) {
          shortCircuit = patches;
        } else if (entry === false) {
            shortCircuit = false;
          } else if (entry) {
              newTree = entry;
            }
      });
    }

    if (shortCircuit !== null || !newTree) {
      return shortCircuit;
    }

    if (newNodeName === textName$1) {
      if (oldNodeName === textName$1 && oldTree.nodeValue !== newTree.nodeValue) {
        patches.push(PATCH_TYPE.NODE_VALUE, oldTree, newTree.nodeValue, oldTree.nodeValue);
        oldTree.nodeValue = newTree.nodeValue;
        return patches;
      } else if (isEmpty) {
          patches.push(PATCH_TYPE.NODE_VALUE, newTree, newTree.nodeValue, null);
          return patches;
        }
    }

    var newChildNodes = newTree.childNodes || [];

    if (newTree.nodeType === 1) {
      var oldAttributes = isEmpty ? EMPTY.OBJ : oldTree.attributes;
      var newAttributes = newTree.attributes;

      for (var key in newAttributes) {
        var value = newAttributes[key];

        if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
          continue;
        }

        if (!isEmpty) {
          oldAttributes[key] = value;
        }

        if ((!oldTree || oldTree.nodeName !== 'script') && newTree.nodeName === 'script' && key === 'type') {
          continue;
        }

        patches.push(PATCH_TYPE.SET_ATTRIBUTE, isEmpty ? newTree : oldTree, key, value);
      }

      if (!isEmpty) {
        for (var _key in oldAttributes) {
          if (_key in newAttributes) {
            continue;
          }

          patches.push(PATCH_TYPE.REMOVE_ATTRIBUTE, oldTree, _key);
          delete oldAttributes[_key];
        }
      }
    }

    if (attributesOnly) {
      for (var i = 0; i < newChildNodes.length; i++) {
        isSVG && svgElements.add(newChildNodes[i]);
        syncTree(null, newChildNodes[i], patches, state, true);
      }

      return patches;
    }

    var keysLookup = {
      old: new Map(),
      new: new Map()
    };

    for (var _i = 0; _i < keyNames.length; _i++) {
      var keyName = keyNames[_i];
      var map = keysLookup[keyName];
      var vTree = arguments[_i];
      var nodes = vTree && vTree.childNodes;

      if (nodes && nodes.length) {
        for (var _i2 = 0; _i2 < nodes.length; _i2++) {
          var _vTree = nodes[_i2];

          if (_vTree.key) {
            if (process$1.env.NODE_ENV !== 'production') {
              if (map.has(_vTree.key)) {
                throw new Error("Key: ".concat(_vTree.key, " cannot be duplicated"));
              }
            }

            map.set(_vTree.key, _vTree);
          }
        }
      }
    }

    var oldChildNodes = oldTree.childNodes;
    var maxLength = max(newChildNodes.length, oldChildNodes.length);

    for (var _i3 = 0; _i3 < maxLength; _i3++) {
      var oldChildNode = oldChildNodes && oldChildNodes[_i3];
      var newChildNode = newChildNodes[_i3];

      if (isSVG || newChildNode && newChildNode.nodeName === 'svg') {
        svgElements.add(newChildNode);
      }

      if (!newChildNode) {
        if (syncTree(oldChildNode, null, patches, state, true) === false) {
          newChildNodes.splice(_i3, 0, oldChildNode);
        }

        continue;
      }

      if (!oldChildNode) {
        oldChildNodes.push(newChildNode);
        syncTree(null, newChildNode, patches, state, true);
        patches.push(PATCH_TYPE.INSERT_BEFORE, oldTree, newChildNode, null);
        continue;
      }

      var newKey = newChildNode.key;
      var oldKey = oldChildNode.key;
      var oldInNew = keysLookup.new.has(oldKey);
      var newInOld = keysLookup.old.has(newKey);

      if (oldKey || newKey) {
        if (!oldInNew && !newInOld) {
          oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1, newChildNode);
          syncTree(null, newChildNode, patches, state, true);
          patches.push(PATCH_TYPE.REPLACE_CHILD, newChildNode, oldChildNode);
          _i3 = _i3 - 1;
          continue;
        } else if (!oldInNew) {
          patches.push(PATCH_TYPE.REMOVE_CHILD, oldChildNode);
          oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1);
          _i3 = _i3 - 1;
          continue;
        }

        if (newKey !== oldKey) {
          var optimalNewNode = newChildNode;

          if (newKey && newInOld) {
            optimalNewNode = keysLookup.old.get(newKey);
            oldChildNodes.splice(oldChildNodes.indexOf(optimalNewNode), 1);
          } else {
            optimalNewNode = newChildNode;
          }

          syncTree(null, optimalNewNode, patches, state, true);
          patches.push(PATCH_TYPE.INSERT_BEFORE, oldTree, optimalNewNode, oldChildNode);
          oldChildNodes.splice(_i3, 0, optimalNewNode);
          continue;
        }
      }

      var sameType = oldChildNode.nodeName === newChildNode.nodeName;
      var retVal = syncTree(oldChildNode, newChildNode, patches, state, !sameType);

      if (retVal === false) {
        newChildNodes.splice(_i3, 0, oldChildNode);
        maxLength += 1;
        continue;
      }

      if (!sameType) {
        oldChildNodes[_i3] = newChildNode;
        var lookupIndex = oldChildNodes.lastIndexOf(newChildNode);

        if (lookupIndex > _i3) {
          oldChildNodes.splice(lookupIndex, 1);
        }

        patches.push(PATCH_TYPE.REPLACE_CHILD, newChildNode, oldChildNode);
      }
    }

    if (oldChildNodes.length !== newChildNodes.length) {
      for (var _i4 = newChildNodes.length; _i4 < oldChildNodes.length; _i4++) {
        patches.push(PATCH_TYPE.REMOVE_CHILD, oldChildNodes[_i4]);
      }

      oldChildNodes.length = newChildNodes.length;
    }

    return patches;
  }

  var globalThis = typeof global === 'object' ? global : window || {};
  var bindingSymbol = Symbol.for('diffHTML');

  var namespace = 'http://www.w3.org/2000/svg';
  var document$1 = globalThis.document || null;
  function createNode(vTreeLike) {
    var ownerDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document$1;
    var isSVG = arguments.length > 2 ? arguments[2] : undefined;

    if (process$1.env.NODE_ENV !== 'production') {
      if (!vTreeLike) {
        throw new Error('Missing VTree when trying to create DOM Node');
      }
    }

    var vTree = createTree(vTreeLike);
    var existingNode = NodeCache.get(vTree);

    if (existingNode) {
      return existingNode;
    }

    var nodeName = vTree.nodeName,
        _vTree$rawNodeName = vTree.rawNodeName,
        rawNodeName = _vTree$rawNodeName === void 0 ? nodeName : _vTree$rawNodeName,
        _vTree$childNodes = vTree.childNodes,
        childNodes = _vTree$childNodes === void 0 ? [] : _vTree$childNodes;
    isSVG = isSVG || nodeName === 'svg';
    var domNode = null;
    var retVal = null;
    CreateNodeHookCache.forEach(function (fn) {
      if (retVal = fn(vTree)) {
        domNode = retVal;
      }
    });

    if (!ownerDocument) {
      return domNode;
    }

    if (domNode === null) {
      if (nodeName === '#text') {
        domNode = ownerDocument.createTextNode(vTree.nodeValue || EMPTY.STR);
      } else if (nodeName === '#document-fragment') {
          domNode = ownerDocument.createDocumentFragment();
        } else if (isSVG) {
            domNode = ownerDocument.createElementNS(namespace, rawNodeName);
          } else {
              domNode = ownerDocument.createElement(rawNodeName);
            }

      if (nodeName === 'script') {
        domNode.type = 'no-execute';
      }
    }

    var validNode = domNode;
    NodeCache.set(vTree, validNode);

    for (var i = 0; i < childNodes.length; i++) {
      var validChildNode = createNode(childNodes[i], ownerDocument, isSVG);
      validNode.appendChild(validChildNode);
    }

    return validNode;
  }

  function syncTrees(transaction) {
    var state = transaction.state,
        measure = transaction.state.measure,
        oldTree = transaction.oldTree,
        newTree = transaction.newTree,
        domNode = transaction.domNode;
    measure('sync trees');

    if (process$1.env.NODE_ENV !== 'production') {
      if (!oldTree) {
        throw new Error('Missing old tree during synchronization');
      }

      if (!newTree) {
        throw new Error('Missing new tree during synchronization');
      }
    }

    if (oldTree && newTree && oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
      if (process$1.env.NODE_ENV !== 'production') {
        if (!domNode.parentNode) {
          throw new Error('Unable to replace top level node without a parent');
        }
      }

      transaction.patches = [PATCH_TYPE.REPLACE_CHILD, newTree, oldTree];
      transaction.oldTree = state.oldTree = newTree;
      var newNode = createNode(newTree);
      StateCache.delete(domNode);
      StateCache.set(newNode, state);
      transaction.domNode = newNode;

      if (newTree.nodeName === 'script') {
        state.scriptsToExecute.set(newTree, newTree.attributes.type || EMPTY.STR);
      }
    } else {
        transaction.patches = syncTree(oldTree || null, newTree || null, [], state);
      }

    measure('sync trees');
  }

  function addTransitionState(stateName, callback) {
    var _TransitionCache$get;

    if (process$1.env.NODE_ENV !== 'production') {
      if (!TransitionStateNames.includes(stateName)) {
        throw new Error("Invalid state name '".concat(stateName, "'"));
      }

      if (!callback) {
        throw new Error('Missing transition state callback');
      }
    }

    (_TransitionCache$get = TransitionCache.get(stateName)) === null || _TransitionCache$get === void 0 ? void 0 : _TransitionCache$get.add(callback);
  }
  function removeTransitionState(stateName, callback) {
    if (process$1.env.NODE_ENV !== 'production') {
      if (stateName && !TransitionStateNames.includes(stateName)) {
        throw new Error("Invalid state name '".concat(stateName, "'"));
      }
    }

    if (!callback && stateName) {
      var _TransitionCache$get2;

      (_TransitionCache$get2 = TransitionCache.get(stateName)) === null || _TransitionCache$get2 === void 0 ? void 0 : _TransitionCache$get2.clear();
    } else if (stateName && callback) {
        var _TransitionCache$get3;

        (_TransitionCache$get3 = TransitionCache.get(stateName)) === null || _TransitionCache$get3 === void 0 ? void 0 : _TransitionCache$get3.delete(callback);
      } else {
          for (var i = 0; i < TransitionStateNames.length; i++) {
            var _TransitionCache$get4;

            (_TransitionCache$get4 = TransitionCache.get(TransitionStateNames[i])) === null || _TransitionCache$get4 === void 0 ? void 0 : _TransitionCache$get4.clear();
          }
        }
  }
  function runTransitions(setName) {
    var set = TransitionCache.get(setName);
    var promises = [];

    if (!set) {
      return promises;
    }

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var vTree = args[0],
        rest = args.slice(1);

    if (!set.size || setName !== 'textChanged' && vTree.nodeType !== 1) {
      return promises;
    }

    set.forEach(function (callback) {
      var retVal = callback.apply(void 0, [NodeCache.get(vTree)].concat(_toConsumableArray(rest)));

      if (typeof retVal === 'object' && retVal.then) {
        promises.push(retVal);
      }
    });

    if (setName === 'attached' || setName === 'detached') {
      vTree.childNodes.forEach(function (childTree) {
        promises.push.apply(promises, _toConsumableArray(runTransitions.apply(void 0, [setName, childTree].concat(_toConsumableArray(rest)))));
      });
    }

    return promises;
  }

  var element = globalThis.document ? document.createElement('div') : null;
  function decodeEntities(string) {
    if (!element || !string || !string.indexOf || !string.includes('&')) {
      return string;
    }

    element.innerHTML = string;
    return element.textContent || EMPTY.STR;
  }

  var keys = Object.keys;
  var blocklist = new Set();
  var allowlist = new Set();
  var DIRECT = ['class', 'checked', 'disabled', 'selected'];

  var setAttribute = function (vTree, domNode, name, value) {
    var isObject = typeof value === 'object' && value;
    var isFunction = typeof value === 'function';
    var isSymbol = typeof value === 'symbol';
    var isEvent = name.indexOf('on') === 0;
    var lowerName = isEvent ? name.toLowerCase() : name;
    var blocklistName = vTree.nodeName + '-' + lowerName;
    var htmlElement = domNode;

    if (allowlist.has(blocklistName)) {
      domNode[lowerName] = value;
    } else if (!blocklist.has(blocklistName)) {
      try {
        domNode[lowerName] = value;
        allowlist.add(blocklistName);
      } catch (unhandledException) {
        blocklist.add(blocklistName);
      }
    }

    if (!isObject && !isFunction && !isSymbol) {
      var noValue = value === null || value === undefined;

      if (lowerName) {
        htmlElement.setAttribute(lowerName, noValue ? EMPTY.STR : value);
      }
    } else if (isObject && lowerName === 'style') {
        var valueKeys = keys(value);

        for (var i = 0; i < valueKeys.length; i++) {
          htmlElement.style[valueKeys[i]] = value[valueKeys[i]];
        }
      }
  };

  var removeAttribute = function (domNode, name) {
    var isEvent = name.indexOf('on') === 0;
    domNode.removeAttribute(name);
    var blocklistName = domNode.nodeName + '-' + name;

    if (allowlist.has(blocklistName)) {
      var anyNode = domNode;

      if (isEvent) {
        anyNode[name] = undefined;
      } else {
        delete anyNode[name];
      }

      if (DIRECT.includes(name)) {
        domNode[name] = false;
      }
    } else if (!blocklist.has(blocklistName)) {
      try {
        var _anyNode = domNode;

        if (isEvent) {
          _anyNode[name] = undefined;
        } else {
          delete _anyNode[name];
        }

        if (DIRECT.includes(name)) {
          domNode[name] = false;
        }

        allowlist.add(blocklistName);
      } catch (unhandledException) {
        blocklist.add(blocklistName);
      }
    }
  };

  var changeNodeValue = function (domNode, nodeValue) {
    var htmlElement = domNode;

    if (nodeValue.includes('&')) {
      htmlElement.nodeValue = decodeEntities(nodeValue);
    } else {
      htmlElement.nodeValue = nodeValue;
    }
  };

  function patchNode(patches) {
    var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EMPTY.OBJ;
    var promises = [];
    var ownerDocument = state.ownerDocument,
        _state$svgElements = state.svgElements,
        svgElements = _state$svgElements === void 0 ? new Set() : _state$svgElements;
    var length = patches.length;
    var i = 0;

    while (true) {
      var patchType = patches[i];

      if (i === length) {
        break;
      }

      switch (patchType) {
        case PATCH_TYPE.SET_ATTRIBUTE:
          {
            var _ret = function () {
              var vTree = patches[i + 1];
              var name = patches[i + 2];
              var value = decodeEntities(patches[i + 3]);
              i += 4;
              var isSVG = svgElements.has(vTree);
              var domNode = createNode(vTree, ownerDocument, isSVG);

              if (!domNode) {
                return "break";
              }

              var oldValue = domNode.getAttribute(name);
              var attributeChangedPromises = runTransitions('attributeChanged', vTree, name, oldValue, value);
              protectVTree(vTree);

              if (attributeChangedPromises.length) {
                Promise.all(attributeChangedPromises).then(function () {
                  return setAttribute(vTree, domNode, name, value);
                });
                promises.push.apply(promises, _toConsumableArray(attributeChangedPromises));
              } else {
                setAttribute(vTree, domNode, name, value);
              }

              return "break";
            }();

            if (_ret === "break") break;
          }

        case PATCH_TYPE.REMOVE_ATTRIBUTE:
          {
            var _ret2 = function () {
              var vTree = patches[i + 1];
              var name = patches[i + 2];
              i += 3;
              var isSVG = svgElements.has(vTree);
              var domNode = createNode(vTree, ownerDocument, isSVG);

              if (!domNode) {
                return "break";
              }

              var oldValue = domNode.getAttribute(name);
              var attributeChangedPromises = runTransitions('attributeChanged', vTree, name, oldValue, null);
              protectVTree(vTree);

              if (attributeChangedPromises.length) {
                Promise.all(attributeChangedPromises).then(function () {
                  return removeAttribute(domNode, name);
                });
                promises.push.apply(promises, _toConsumableArray(attributeChangedPromises));
              } else {
                removeAttribute(domNode, name);
              }

              return "break";
            }();

            if (_ret2 === "break") break;
          }

        case PATCH_TYPE.NODE_VALUE:
          {
            var _ret3 = function () {
              var vTree = patches[i + 1];
              var nodeValue = patches[i + 2];
              var oldValue = patches[i + 3];
              var isSVG = svgElements.has(vTree);
              i += 4;
              var domNode = createNode(vTree, ownerDocument, isSVG);

              if (!domNode) {
                return "break";
              }

              protectVTree(vTree);
              var textChangedPromises = runTransitions('textChanged', vTree, oldValue, nodeValue);

              if (textChangedPromises.length) {
                Promise.all(textChangedPromises).then(function () {
                  return changeNodeValue(domNode, nodeValue);
                });
                promises.push.apply(promises, _toConsumableArray(textChangedPromises));
              } else {
                changeNodeValue(domNode, nodeValue);
              }

              return "break";
            }();

            if (_ret3 === "break") break;
          }

        case PATCH_TYPE.INSERT_BEFORE:
          {
            var vTree = patches[i + 1];
            var newTree = patches[i + 2];
            var refTree = patches[i + 3];
            i += 4;
            var domNode = NodeCache.get(vTree);

            if (!domNode) {
              break;
            }

            var isSVG = svgElements.has(newTree);
            protectVTree(newTree);
            var refNode = refTree && createNode(refTree, ownerDocument, isSVG);
            var newNode = createNode(newTree, ownerDocument, isSVG);
            domNode.insertBefore(newNode, refNode || null);
            promises.push.apply(promises, _toConsumableArray(runTransitions('attached', newTree)));
            break;
          }

        case PATCH_TYPE.REPLACE_CHILD:
          {
            var _ret4 = function () {
              var _TransitionCache$get, _TransitionCache$get2, _TransitionCache$get3;

              var newTree = patches[i + 1];
              var oldTree = patches[i + 2];
              i += 3;
              var isSVG = svgElements.has(newTree);
              var oldDomNode = NodeCache.get(oldTree);
              var newDomNode = createNode(newTree, ownerDocument, isSVG);

              if (!oldDomNode || !oldDomNode.parentNode) {
                return "break";
              }

              protectVTree(newTree);
              var hasAttached = (_TransitionCache$get = TransitionCache.get('attached')) === null || _TransitionCache$get === void 0 ? void 0 : _TransitionCache$get.size;
              var hasDetached = (_TransitionCache$get2 = TransitionCache.get('detached')) === null || _TransitionCache$get2 === void 0 ? void 0 : _TransitionCache$get2.size;
              var hasReplaced = (_TransitionCache$get3 = TransitionCache.get('replaced')) === null || _TransitionCache$get3 === void 0 ? void 0 : _TransitionCache$get3.size;

              if (!hasAttached && !hasDetached && !hasReplaced) {
                if (oldDomNode.parentNode) {
                  unprotectVTree(oldTree);
                  oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
                }

                return "break";
              }

              if (oldDomNode.parentNode) {
                oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
              }

              var attachedPromises = runTransitions('attached', newTree);
              var detachedPromises = runTransitions('detached', oldTree);
              var replacedPromises = runTransitions('replaced', oldTree, newDomNode);
              var allPromises = [].concat(_toConsumableArray(attachedPromises), _toConsumableArray(detachedPromises), _toConsumableArray(replacedPromises));

              if (allPromises.length) {
                Promise.all(allPromises).then(function () {
                  if (oldDomNode.parentNode) {
                    oldDomNode.parentNode.removeChild(oldDomNode);
                  }

                  unprotectVTree(oldTree);
                });
                promises.push.apply(promises, _toConsumableArray(allPromises));
              } else {
                if (oldDomNode.parentNode) {
                  oldDomNode.parentNode.removeChild(oldDomNode);
                }

                unprotectVTree(oldTree);
              }

              return "break";
            }();

            if (_ret4 === "break") break;
          }

        case PATCH_TYPE.REMOVE_CHILD:
          {
            var _ret5 = function () {
              var vTree = patches[i + 1];
              i += 2;
              var domNode = NodeCache.get(vTree);

              if (!domNode || !domNode.parentNode) {
                return "break";
              }

              var detachedPromises = runTransitions('detached', vTree);

              if (detachedPromises.length) {
                Promise.all(detachedPromises).then(function () {
                  if (domNode.parentNode) {
                    domNode.parentNode.removeChild(domNode);
                  }

                  unprotectVTree(vTree);
                });
                promises.push.apply(promises, _toConsumableArray(detachedPromises));
              } else {
                if (domNode.parentNode) {
                  domNode.parentNode.removeChild(domNode);
                }

                unprotectVTree(vTree);
              }

              return "break";
            }();

            if (_ret5 === "break") break;
          }
      }
    }

    return promises;
  }

  function patch(transaction) {
    var domNode = transaction.domNode,
        state = transaction.state,
        _transaction$state = transaction.state,
        measure = _transaction$state.measure,
        scriptsToExecute = _transaction$state.scriptsToExecute,
        patches = transaction.patches;
    var ownerDocument = domNode.ownerDocument;
    var promises = transaction.promises || [];
    state.ownerDocument = ownerDocument || globalThis.document;

    var collectScripts = function (vTree) {
      if (vTree.nodeName === 'script') {
        scriptsToExecute.set(vTree, vTree.attributes.type);
      }
    };

    CreateNodeHookCache.add(collectScripts);
    measure('patch node');
    promises.push.apply(promises, _toConsumableArray(patchNode(patches, state)));
    measure('patch node');
    CreateNodeHookCache.delete(collectScripts);
    transaction.promises = promises;
  }

  function endAsPromise(transaction) {
    var promises = transaction.promises;

    if (promises && promises.length) {
      return transaction.promise = Promise.all(promises).then(function () {
        return transaction.end();
      });
    }

    return transaction.promise = Promise.resolve(transaction.end());
  }

  var defaultTasks = [schedule, shouldUpdate, reconcileTrees, syncTrees, patch, endAsPromise];
  var tasks = {
    schedule: schedule,
    shouldUpdate: shouldUpdate,
    reconcileTrees: reconcileTrees,
    syncTrees: syncTrees,
    patchNode: patch,
    endAsPromise: endAsPromise
  };

  var Transaction = function () {
    _createClass(Transaction, null, [{
      key: "create",
      value: function create(domNode, input, options) {
        return new Transaction(domNode, input, options);
      }
    }, {
      key: "flow",
      value: function flow(transaction, tasks) {
        var retVal = transaction;

        for (var i = 0; i < tasks.length; i++) {
          if (transaction.aborted) {
            return retVal;
          }

          retVal = tasks[i](transaction);

          if (retVal !== undefined && retVal !== transaction) {
            return retVal;
          }
        }

        return retVal;
      }
    }, {
      key: "assert",
      value: function assert(transaction) {
        if (process$1.env.NODE_ENV !== 'production') {
          if (typeof transaction.domNode !== 'object' || !transaction.domNode) {
            throw new Error('Transaction requires a DOM Node mount point');
          }

          if (transaction.aborted && transaction.completed) {
            throw new Error('Transaction was previously aborted');
          }

          if (transaction.completed) {
            throw new Error('Transaction was previously completed');
          }
        }
      }
    }, {
      key: "invokeMiddleware",
      value: function invokeMiddleware(transaction) {
        var tasks = transaction.tasks;
        MiddlewareCache.forEach(function (fn) {
          var result = fn(transaction);

          if (result) {
            tasks.push(result);
          }
        });
      }
    }]);

    function Transaction(domNode, input, options) {
      _classCallCheck(this, Transaction);

      _defineProperty(this, "domNode", EMPTY.STR);

      _defineProperty(this, "markup", EMPTY.STR);

      _defineProperty(this, "oldTree", undefined);

      _defineProperty(this, "newTree", undefined);

      _defineProperty(this, "promise", undefined);

      _defineProperty(this, "promises", undefined);

      _defineProperty(this, "tasks", []);

      _defineProperty(this, "patches", []);

      this.domNode = domNode;
      this.markup = input;
      this.options = options;
      this.state = StateCache.get(domNode) || {
        measure: makeMeasure(domNode, input),
        svgElements: new Set(),
        scriptsToExecute: new Map()
      };

      if (options.tasks && options.tasks.length) {
        this.tasks = _toConsumableArray(options.tasks);
      }

      this.endedCallbacks = new Set();
      StateCache.set(domNode, this.state);
    }

    _createClass(Transaction, [{
      key: "start",
      value: function start() {
        if (process$1.env.NODE_ENV !== 'production') {
          Transaction.assert(this);
        }

        var measure = this.state.measure,
            tasks = this.tasks;
        var takeLastTask = tasks.pop();
        this.aborted = false;
        Transaction.invokeMiddleware(this);
        measure('render');
        takeLastTask && tasks.push(takeLastTask);
        return Transaction.flow(this, tasks);
      }
    }, {
      key: "abort",
      value: function abort(isReturn) {
        this.aborted = true;

        if (isReturn) {
          return this.tasks[this.tasks.length - 1](this);
        }
      }
    }, {
      key: "end",
      value: function end() {
        var _this = this;

        var state = this.state,
            domNode = this.domNode,
            options = this.options;
        var measure = state.measure,
            svgElements = state.svgElements,
            scriptsToExecute = state.scriptsToExecute;
        measure('finalize');
        this.completed = true;
        svgElements.clear();
        state.isRendering = false;
        scriptsToExecute.forEach(function () {
          var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : EMPTY.STR;
          var vTree = arguments.length > 1 ? arguments[1] : undefined;
          var oldNode = NodeCache.get(vTree);
          if (type) oldNode.setAttribute('type', type);else oldNode.removeAttribute('type');
        });
        state.previousMarkup = 'outerHTML' in domNode ? domNode.outerHTML : EMPTY.STR;

        if (options.executeScripts) {
          scriptsToExecute.forEach(function (_, vTree) {
            var oldNode = NodeCache.get(vTree);
            var newNode = oldNode.cloneNode(true);

            if (!oldNode) {
              return;
            }

            if (StateCache.has(oldNode)) {
              release(oldNode);
              StateCache.set(newNode, state);
            }

            NodeCache.set(vTree, newNode);
            oldNode.parentNode && oldNode.parentNode.replaceChild(newNode, oldNode);
          });
        }

        scriptsToExecute.clear();
        measure('finalize');
        measure('render');
        gc();
        this.endedCallbacks.forEach(function (callback) {
          return callback(_this);
        });
        this.endedCallbacks.clear();
        return this;
      }
    }, {
      key: "onceEnded",
      value: function onceEnded(callback) {
        this.endedCallbacks.add(callback);
      }
    }]);

    return Transaction;
  }();

  function parseNewTree(transaction) {
    var state = transaction.state,
        markup = transaction.markup,
        options = transaction.options;
    var measure = state.measure;
    var inner = options.inner;

    if (typeof markup === 'string') {
      measure('parsing markup for new tree');

      var _parse = parse(markup, undefined, options),
          childNodes = _parse.childNodes;

      var vTree = createTree(inner ? childNodes : childNodes[0] || childNodes);

      if (vTree) {
        transaction.newTree = vTree;
      }

      measure('parsing markup for new tree');
    }
  }

  function escape(unescaped) {
    return unescaped.replace(/[&<>]/g, function (match) {
      return "&#".concat(match.charCodeAt(0), ";");
    });
  }

  var internals = _objectSpread2({
    decodeEntities: decodeEntities,
    escape: escape,
    makeMeasure: makeMeasure,
    memory: memory$3,
    Pool: Pool,
    process: process$1,
    PATCH_TYPE: PATCH_TYPE,
    createNode: createNode,
    syncTree: syncTree,
    Transaction: Transaction,
    defaultTasks: defaultTasks,
    tasks: tasks
  }, caches);

  function innerHTML(domNode) {
    var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EMPTY.STR;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY.OBJ;
    options.inner = true;
    options.executeScripts = 'executeScripts' in options ? options.executeScripts : true;
    options.tasks = options.tasks || defaultTasks;
    return Transaction.create(domNode, input, options).start();
  }

  function outerHTML(domNode) {
    var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EMPTY.STR;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY.OBJ;
    options.inner = false;
    options.tasks = options.tasks || defaultTasks;
    options.executeScripts = 'executeScripts' in options ? options.executeScripts : true;
    return Transaction.create(domNode, input, options).start();
  }

  var isArray$2 = Array.isArray;
  var isTagEx = /(<|\/)/;

  var nextValue = function (values) {
    var value = values.shift();
    return typeof value === 'string' ? escape(decodeEntities(value)) : value;
  };

  function handleTaggedTemplate(strings) {
    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    var empty = createTree('#text', EMPTY.STR);

    if (!strings) {
      return empty;
    } else if (typeof strings === 'string') {
        strings = [strings];
      }

    if (strings.length === 1 && !values.length) {
      var _strict = handleTaggedTemplate.isStrict;
      handleTaggedTemplate.isStrict = false;

      if (!strings[0]) {
        return empty;
      }

      var _parse = parse(strings[0], undefined, {
        parser: {
          strict: _strict
        }
      }),
          _childNodes = _parse.childNodes;

      return createTree(_childNodes.length === 1 ? _childNodes[0] : _childNodes);
    }

    var HTML = EMPTY.STR;
    var supplemental = {
      attributes: {},
      children: {},
      tags: {}
    };
    strings.forEach(function (string, i) {
      HTML += string;

      if (values.length) {
        var value = nextValue(values);
        var lastCharacter = HTML.trim().slice(-1);
        var isAttribute = HTML.lastIndexOf('>') < HTML.lastIndexOf('<');
        var isTag = Boolean(lastCharacter.match(isTagEx));
        var isObject = typeof value === 'object';
        var token = "".concat(TOKEN).concat(i, "__");

        if (isTag) {
          supplemental.tags[i] = value;
          HTML += token;
        } else if (isAttribute) {
            supplemental.attributes[i] = value;
            HTML += token;
          } else if (isArray$2(value) || isObject) {
              supplemental.children[i] = createTree(value);
              HTML += token;
            } else if (value) {
                HTML += value;
              }
      }
    });
    var strict = handleTaggedTemplate.isStrict;
    handleTaggedTemplate.isStrict = false;

    var _parse2 = parse(HTML, supplemental, {
      parser: {
        strict: strict
      }
    }),
        childNodes = _parse2.childNodes;

    return createTree(childNodes.length === 1 ? childNodes[0] : childNodes);
  }
  handleTaggedTemplate.isStrict = false;

  function setStrictMode(markup) {
    handleTaggedTemplate.isStrict = true;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return handleTaggedTemplate.apply(void 0, [markup].concat(args));
  }

  handleTaggedTemplate.strict = setStrictMode;

  var isArray$3 = Array.isArray;
  function use(middleware) {
    var isFunction = typeof middleware === 'function';
    var isObject = typeof middleware === 'object';

    if (process$1.env.NODE_ENV !== 'production') {
      if (!middleware || !isFunction && !isObject || isArray$3(middleware)) {
        throw new Error('Middleware must be a function or plain object');
      }
    }

    var subscribe = middleware.subscribe,
        unsubscribe = middleware.unsubscribe,
        createTreeHook = middleware.createTreeHook,
        createNodeHook = middleware.createNodeHook,
        syncTreeHook = middleware.syncTreeHook,
        releaseHook = middleware.releaseHook,
        parseHook = middleware.parseHook;
    isFunction && MiddlewareCache.add(middleware);
    subscribe && subscribe(internals);
    createTreeHook && CreateTreeHookCache.add(createTreeHook);
    createNodeHook && CreateNodeHookCache.add(createNodeHook);
    syncTreeHook && SyncTreeHookCache.add(syncTreeHook);
    releaseHook && ReleaseHookCache.add(releaseHook);
    parseHook && ParseHookCache.add(parseHook);
    return function () {
      isFunction && MiddlewareCache.delete(middleware);
      unsubscribe && unsubscribe(internals);
      createTreeHook && CreateTreeHookCache.delete(createTreeHook);
      createNodeHook && CreateNodeHookCache.delete(createNodeHook);
      syncTreeHook && SyncTreeHookCache.delete(syncTreeHook);
      releaseHook && ReleaseHookCache.delete(releaseHook);
      parseHook && ParseHookCache.delete(parseHook);
    };
  }

  var __VERSION__ = '1.0.0-beta.18';

  defaultTasks.splice(defaultTasks.indexOf(reconcileTrees), 0, parseNewTree);
  internals.parse = parse;
  internals.VERSION = __VERSION__;
  var api = {};
  api.VERSION = __VERSION__;
  api.addTransitionState = addTransitionState;
  api.removeTransitionState = removeTransitionState;
  api.release = release;
  api.createTree = createTree;
  api.use = use;
  api.outerHTML = outerHTML;
  api.innerHTML = innerHTML;
  api.html = handleTaggedTemplate;
  api.Internals = internals;
  var global$1 = globalThis;
  var hasBinding = (bindingSymbol in globalThis);

  if (hasBinding) {
    var existingApi = global$1[bindingSymbol];

    if (__VERSION__ !== existingApi.VERSION) {
      console.log("Tried to load ".concat(__VERSION__, " after ").concat(existingApi.VERSION));
    }
  } else {
    global$1[bindingSymbol] = api;

    if (global$1.devTools) {
      global$1.unsubscribeDevTools = use(global$1.devTools(internals));
    }
  }

  exports.Internals = internals;
  exports.VERSION = __VERSION__;
  exports.addTransitionState = addTransitionState;
  exports.createTree = createTree;
  exports.default = api;
  exports.html = handleTaggedTemplate;
  exports.innerHTML = innerHTML;
  exports.outerHTML = outerHTML;
  exports.release = release;
  exports.removeTransitionState = removeTransitionState;
  exports.use = use;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
