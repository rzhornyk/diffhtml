import { spy, stub } from 'sinon';
import Transaction from '../../lib/transaction';

describe('Unit: Transaction', function() {
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

  describe('renderNext', () => {
    it('can render the next transaction in the queue', () => {
      const { domNode, markup, options } = this;
      const nextTransaction = { domNode, markup, options };
      const transaction = Transaction.create(domNode, markup, options);

      Object.assign(transaction.state, { nextTransaction });

      transaction.start();

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

    it('will abort a flow when a function returns a value', () => {
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

    it('will pass initial value as arguments to all functions', () => {
      const valueOne = {};
      const valueTwo = {};
      const testFn = spy();
      const testFnTwo = spy();

      Transaction.flow(this, [testFn, testFnTwo])();

      assert.equal(testFn.calledOnce, true);
      assert.equal(testFn.calledWith(this), true);

      assert.equal(testFnTwo.calledOnce, true);
      assert.equal(testFnTwo.calledWith(this), true);
    });
  });
});
