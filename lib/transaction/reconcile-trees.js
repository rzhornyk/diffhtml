import { protectElement, unprotectElement } from '../util/memory';
import { parse } from '../util/parser';
import { pools } from '../util/pools';
import { createElement } from '../tree/helpers';
import makeTree from '../tree/make';

/**
 * Gets a Virtual Tree Element from the markup passed to a diff method.
 *
 * @param {String|Object} markup - HTML/DOM Node/Virtual Tree Element
 * @return {Object} - Virtual Tree Element
 */
const getTreeFromNewHTML = (markup, options, callback) => {
  // This is HTML Markup, so we need to parse it.
  if (typeof markup === 'string') {
    const silenceWarnings = options.silenceWarnings;
    const childNodes = parse(markup, null, { silenceWarnings }).childNodes;

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one.
    return callback(childNodes);
  }
  // This is a DOM Node, so we need to convert to a vTree.
  else if (markup.ownerDocument) {
    const newTree = makeTree(markup);

    if (newTree.nodeType === 11) {
      pools.elementObject.unprotect(newTree);
      return callback(newTree.childNodes);
    }

    return callback(newTree);
  }

  // This is a Virtual Tree Element, or something like it, so we can just pass
  // it along.
  return callback(markup);
};

export default function reconileTrees(transaction) {
  const { state, domNode, markup, options } = transaction;
  const { previousMarkup, previousText, oldTree } = state;
  const { inner } = options;

  state.mark('reconcile trees');

  // This looks for changes in the DOM from what we'd expect. This means we
  // need to rebuild the old Virtual Tree. This allows for keeping our tree
  // in sync with unexpected DOM changes. It's not very performant, so
  // ideally you should never change markup that diffHTML affects from
  // outside of diffHTML if performance is a concern.
  const sameInnerHTML = inner ? previousMarkup === domNode.innerHTML : true;
  const sameOuterHTML = inner ? true : previousMarkup === domNode.outerHTML;
  const sameTextContent = previousText === domNode.textContent;

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (!sameInnerHTML || !sameOuterHTML || !sameTextContent) {
    if (oldTree) {
      unprotectElement(oldTree);
    }

    state.oldTree = protectElement(makeTree(domNode));
  }

  // We need to ensure that our target to diff is a Virtual Tree Element. This
  // function takes in whatever `markup` is and normalizes to a tree object.
  // The callback function runs on every normalized Node to wrap childNodes
  // in the case of setting innerHTML.
  state.newTree = getTreeFromNewHTML(markup, options, newTree => {
    if (inner) {
      // TODO This was removed for some reason...
      //pools.elementObject.unprotect(newTree);

      const nodeName = state.oldTree.nodeName;
      const attributes = state.oldTree.attributes;

      if (typeof newTree.nodeName === 'function') {
        return createElement(nodeName, attributes, newTree);
      }

      return createElement(nodeName, attributes, newTree);
    }

    return Array.isArray(newTree) ? newTree[0] : newTree;
  });

  state.mark('reconcile trees');
}
