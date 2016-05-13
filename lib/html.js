import { makeParser } from './util/parser';

// Make a parser.
const parser = makeParser();

/**
 * Parses a tagged template literal into a diffHTML Virtual DOM representation.
 *
 * @param strings
 * @param ...values
 *
 * @return
 */
export function html(strings, ...values) {
  // Do not attempt to parse empty strings.
  if (!strings[0].length && !values.length) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    return parser.parse(strings[0]).childNodes[0];
  }

  var retVal = [];
  var supplemental = {
    props: [],
    children: [],
  };

  // Loop over the strings and interpolate the values.
  strings.forEach(string => {
    retVal.push(string);

    if (values.length) {
      let value = values.shift();
      let lastSegment = string.split(' ').pop();
      let lastCharacter = lastSegment.trim().slice(-1);
      let isProp = Boolean(lastCharacter.match(/(=|'|")/));
      let isChildren = lastCharacter === '>';

      if (isProp) {
        supplemental.props.push(value);
        retVal.push('__DIFFHTML__');
      }
      else if (isChildren) {
        if (typeof value === 'string') {
          retVal.push(value);
        }
        else if (typeof value !== 'object') {
          throw new Error('Children must be a string or object');
        }

        supplemental.children.push(value);
        retVal.push('<__DIFFHTML__/>');
      }
      else {
        retVal.push(String(value));
      }
    }
  });

  return parser.parse(retVal.join(''), supplemental).childNodes[0];
}
