import { spy, stub } from 'sinon';
import Transaction from '../../lib/transaction';

describe.only('Unit: Transaction', function() {
  beforeEach(() => {
    this.domNode = document.createElement('div');
    this.markup = `
      <div>Hello world</div>
    `;
    this.options = { inner: false };
  });

  describe('create', () => {
    it('will return a transaction instance', () => {
      const { domNode, markup, options } = this;
      const transaction = new Transaction(domNode, markup, options);

      assert.ok(transaction instanceof Transaction);
    });
  });

  describe('flow', () => {
    it('can set up a single function to flow', () => {
      const testFn = spy();

      Transaction.flow(this, [testFn])();

      assert.equal(testFn.calledOnce, true);
      assert.equal(testFn.calledWith(this), true);
    });

    it('can set up multiple functions to run', () => {
      const testFn = spy();
      const testFnTwo = spy();

      Transaction.flow(this, [testFn, testFnTwo])();

      assert.equal(testFn.calledOnce, true);
      assert.equal(testFnTwo.calledOnce, true);
    });

    it('can abort a flow when a function explictly returns `false`', () => {
      const testFn = spy();
      const testFnTwo = stub().returns(false);
      const testFnThree = spy();

      Transaction.flow(this, [testFn, testFnTwo, testFnThree])();

      assert.equal(testFn.calledOnce, true);
      assert.equal(testFnTwo.calledOnce, true);
      assert.equal(testFnThree.calledOnce, false);
    });

    it('will throw an exception if any values are not functions', () => {
      const testFn = spy();
      const testFnTwo = undefined;

      assert.throws(() => Transaction.flow(testFn, testFnTwo)());
    });

    it('will pass return values as arguments', () => {
      const valueOne = {};
      const valueTwo = {};
      const testFn = stub().returns(valueOne);
      const testFnTwo = spy();

      Transaction.flow(this, [testFn, testFnTwo])();

      assert.equal(testFn.calledOnce, true);
      assert.equal(testFn.calledWith(this), true);

      assert.equal(testFnTwo.calledOnce, true);
      assert.equal(testFnTwo.calledWith(valueOne), true);
    });
  });
});
