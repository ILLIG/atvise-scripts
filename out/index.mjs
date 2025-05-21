import { p as prepare$1, d as deploy$1 } from './index-Dn6UDCQK.mjs';

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
const deploy = scriptRunner(deploy$1);
const prepare = scriptRunner(prepare$1);

export { deploy, prepare };
