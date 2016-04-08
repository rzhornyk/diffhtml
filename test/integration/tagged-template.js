import * as diff from '../../lib/index';
import { html } from '../../lib/index';
import validateMemory from '../util/validateMemory';

describe('Integration: Tagged template', function() {
  beforeEach(function() {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = '<div></div>';
  });

  afterEach(function() {
    diff.release(this.fixture);
    diff.removeTransitionState();

    validateMemory();
  });

  describe('Tagged template string function', function() {
    it('works?', function() {
      var actual = html`<div>hello world</div>`;
      var expected = {
        uuid: actual.uuid,
        nodeName: 'div',
        nodeType: 1,
        nodeValue: '',
        attributes: [],
        childNodes: [{
          // We use the real uuid here, because we don't really need to test
          // if a uuid function works here.
          uuid: actual.childNodes[0].uuid,
          nodeName: '#text',
          nodeType: 3,
          nodeValue: 'hello world',
          attributes: [],
          childNodes: [],
        }],
      };

      assert.deepEqual(actual, expected);
    });

    it.only('works with object', function() {
      var items = [1, 2, 3];
      var actual = html`<ul>
        ${items.map(label => html`<li>${label}</li>`)}
      </ul>`;

      console.log(JSON.stringify(actual, null, 2));

      var expected = {
        uuid: actual.uuid,
        nodeName: 'div',
        nodeType: 1,
        nodeValue: '',
        attributes: [],
        childNodes: [{
          // We use the real uuid here, because we don't really need to test
          // if a uuid function works here.
          uuid: actual.childNodes[0].uuid,
          nodeName: '#text',
          nodeType: 3,
          nodeValue: 'hello world',
          attributes: [],
          childNodes: [],
        }],
      };

      assert.deepEqual(actual, expected);
    });
  });
});
