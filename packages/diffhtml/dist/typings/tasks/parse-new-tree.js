import parse from '../util/parse';
import createTree from '../tree/create';
/**
 * @param {Transaction} transaction
 */
export default function parseNewTree(transaction) {
    const { state, markup, options } = transaction;
    const { measure } = state;
    const { inner } = options;
    if (typeof markup === 'string') {
        measure('parsing markup for new tree');
        const { childNodes } = parse(markup, undefined, options);
        // If we are dealing with innerHTML, use all the Nodes. If we're dealing
        // with outerHTML, we can only support diffing against a single element,
        // so pick the first one, if there are none, just pass the entire root.
        const vTree = createTree(inner ? childNodes : childNodes[0] || childNodes);
        if (vTree) {
            transaction.newTree = vTree;
        }
        measure('parsing markup for new tree');
    }
}
