'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('debug');
require('./errors-1d9b9f08.js');
require('fs');
require('deepmerge');
require('write-json-file');
var config = require('./config-7bad29d8.js');
var fs$1 = require('./fs-009f2a20.js');
var writePkg = _interopDefault(require('write-pkg'));

async function runPrepare({
  info,
  confirm
}) {
  const pkg = await fs$1.readJson('./package.json');
  const config$1 = await config.load({
    confirmFallback: confirm
  });
  const proxyUrl = `http://${config$1.host}:${config$1.port.http}`;
  if (pkg.proxy !== proxyUrl) {
    info('Updating proxy settings...');
    pkg.proxy = proxyUrl;
    writePkg('./package.json', pkg);
  }
}

exports.default = runPrepare;
