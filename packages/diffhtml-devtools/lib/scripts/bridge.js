import unique from 'unique-selector';

const cacheTask = [];
const selectors = new Map();
const { assign } = Object;
const toggleMiddleware = {};
const anon = 'anonymous_';

function getMiddlewareName(userMiddleware, i) {
  const raw = userMiddleware.displayName || userMiddleware.name || anon + i;

  return [raw, raw
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .split(' ').slice(0, -1).join(' ')];
}

// Called by diffHTML index/runtime entry points.
export default function devTools(Internals) {
  let extension = null;
  let interval = null;

  // Toggle if a middleware is enabled/disabled.
  document.addEventListener('diffHTML:toggleMiddleware', ev => {
    const { detail } = ev;

    Internals.MiddlewareCache.forEach((userMiddleware, i) => {
      const [ raw, name ] = getMiddlewareName(userMiddleware);

      // Ignore Middleware names that don't match.
      if (detail.name !== name) {
        return;
      }

      // If we are enabling, and have previously disabled, remove the
      // placeholder and add back the original.
      if (detail.enabled && toggleMiddleware[name]) {
        const middleware = toggleMiddleware[name];
        Internals.MiddlewareCache.delete(userMiddleware);
        Internals.MiddlewareCache.add(middleware);
        delete toggleMiddleware[name];

        if (middleware.subscribe) {
          middleware.subscribe(Internals);
        }
      }
      // Otherwise if we are disabling, and have not previously disabled, cache
      // the current middleware, and replace with a placeholder.
      else if (!detail.enabled && !toggleMiddleware[name]) {
        Internals.MiddlewareCache.delete(userMiddleware);
        toggleMiddleware[name] = userMiddleware;
        Internals.MiddlewareCache.add(assign(() => {}, { displayName: raw }));

        if (userMiddleware.unsubscribe) {
          userMiddleware.unsubscribe(Internals);
        }
      }
    });
  });

  document.addEventListener('diffHTML:gc', () => Internals.memory.gc());

  const filterVTree = vTree => {
    if (!vTree) { return vTree; }

    if (typeof vTree.rawNodeName === 'function') {
      vTree.nodeName = vTree.rawNodeName.displayName || vTree.rawNodeName.name;
    }

    vTree.childNodes = vTree.childNodes.map(filterVTree);
    return vTree;
  };

  const pollForFunction = () => new Promise(resolve => {
    if (window.__diffHTMLDevTools) {
      resolve(window.__diffHTMLDevTools);
    }
    else {
      // Polling interval that looks for the diffHTML devtools hook.
      interval = setInterval(() => {
        if (window.__diffHTMLDevTools) {
          clearInterval(interval);
          resolve(window.__diffHTMLDevTools);
        }
      }, 2000);
    }
  });

  const getInternals = () => {
    const { VERSION, Pool, MiddlewareCache } = Internals;
    const middleware = [];

    MiddlewareCache.forEach(userMiddleware => {
      const [ __unused, name ] = getMiddlewareName(userMiddleware);
      middleware.push(name);
    });

    const mounts = [];

    selectors.forEach((tree, selector) => mounts.push({
      selector,
      tree: filterVTree(tree),
    }));

    const memory = {
      time: Date.now(),
      free: Pool.memory.free.size,
      allocated: Pool.memory.allocated.size,
      protected: Pool.memory.protected.size,
    };

    return {
      version: VERSION,
      middleware,
      mounts,
      memory,
    };
  };

  let surpressedCount = 0;
  let lastRun = 0;

  function devToolsTask(transaction) {
    const {
      domNode, markup, options, state: { newTree }, state
    } = transaction;

    const isFunction = typeof domNode.rawNodeName === 'function';
    const selector = unique(domNode) ||
      `${isFunction ? domNode.rawNodeName.displayName || domNode.rawNodeName.name : domNode.rawNodeName}`;
    const startDate = performance.now();

    // If we are getting renders too quickly, restrict them from being sent.
    if (lastRun !== 0 && (startDate - lastRun) < 1000) {
      surpressedCount += 1;
      return;
    }
    else {
      lastRun = startDate;
    }

    const cachedSurpressedCount = surpressedCount;
    surpressedCount = 0;

    const start = () => {
      return extension.startTransaction(startDate, {
        domNode: selector,
        markup,
        options,
        surpressedCount: cachedSurpressedCount,
        state: assign({}, state, state.nextTransaction && {
          nextTransaction: undefined,
        }, {
          activeTransaction: undefined,
        }),
      });
    };

    // Start task.
    if (!extension) {
      cacheTask.push(() => start());
    } else {
      start();
    }

    selectors.set(selector, newTree);

    return function() {
      const patches = JSON.parse(JSON.stringify(transaction.patches));
      const promises = transaction.promises.slice();

      transaction.onceEnded(() => {
        const endDate = performance.now();

        // Update with the newTree after a render has completed.
        selectors.set(selector, transaction.oldTree);

        const { aborted, completed } = transaction;
        const stop = () => extension.endTransaction(startDate, endDate, {
          domNode: selector,
          markup,
          options,
          surpressedCount: cachedSurpressedCount,
          state: assign({}, state, state.nextTransaction && {
            nextTransaction: undefined,
          }, {
            activeTransaction: undefined,
          }),
          patches,
          promises,
          completed,
          aborted,
        });

        if (!extension) {
          cacheTask.push(() => stop());
        } else {

          extension.activate(getInternals());
          stop();
        }
      });
    };
  }

  async function setExtension(initial) {
    const devToolsExtension = await pollForFunction();

    extension = devToolsExtension().activate({
      // Reset counts per unique activation.
      inProgress: initial ? [] : null,
      completed: initial ? [] : null,

      ...getInternals(),
    });
  }

  // Send a ping every 2 seconds. If we do not receive a response and time out,
  // reconnect.
  function keepAlive() {
    extension.ping();

    let primaryTimeout = null;
    let scheduleTimeout = null;

    const schedule = () => {
      clearTimeout(primaryTimeout);
      scheduleTimeout = setTimeout(keepAlive, 5000);
    };

    document.addEventListener('diffHTML:pong', schedule, { once: true });

    // If we do not receive a response after 1 second, try and reconnect.
    primaryTimeout = setTimeout(async () => {
      document.removeEventListener('diffHTML:pong', schedule);
      clearTimeout(scheduleTimeout);
      await setExtension();
    }, 1000);
  }

  devToolsTask.subscribe = async () => {
    await setExtension(true);

    // Start keep-alive in case we disconnect.
    //keepAlive();

    // Call existing cached tasks.
    if (cacheTask.length) {
      cacheTask.forEach(cb => cb());
      cacheTask.length = 0;
    }
  };

  return devToolsTask;
}
