export default typeof process !== 'undefined' ? process : {
    env: { NODE_ENV: 'development' },
    argv: /** @type {string[]} */ ([]),
};
