export default function shouldUpdate(transaction) {
  const { markup, state } = transaction;

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof markup === 'string' && state.markup === markup) {
    return false;
  }
  else if (typeof markup === 'string') {
    state.markup = markup;
  }

  performance.mark('shouldUpdate end');
  performance.measure(
    'diffHTML render shouldUpdate',
    'start',
    'shouldUpdate end'
  );

  return transaction;
}
