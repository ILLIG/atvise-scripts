'use strict';

var index = require('./index-Cp7kYSmB.js');

const scriptRunner = script => options => {
  var _options$doInteractiv;
  const defaultDoInteractive = (fn, fallback) => fallback;
  return script.run({
    info: console.info,
    warn: console.warn,
    doInteractive: (_options$doInteractiv = options === null || options === void 0 ? void 0 : options.doInteractive) !== null && _options$doInteractiv !== void 0 ? _options$doInteractiv : defaultDoInteractive,
    ...options
  });
};
const deploy = scriptRunner(index.deploy);
const prepare = scriptRunner(index.prepare);

exports.deploy = deploy;
exports.prepare = prepare;
