'use strict';

var writePackage = require('write-package');
var config = require('./config-BD5gdro4.js');
var fs = require('./fs-4dm3ZD0m.js');
require('deepmerge');
require('debug');
require('write-json-file');
require('./errors-BAcmNQ9_.js');
require('fs');

async function runPrepare({
  info,
  confirm
}) {
  const pkg = await fs.readJson('./package.json');
  const config$1 = await config.load({
    confirmFallback: confirm
  });
  const proxyUrl = `http://${config$1.host}:${config$1.port.http}`;
  if (pkg.proxy !== proxyUrl) {
    info('Updating proxy settings...');
    pkg.proxy = proxyUrl;
    writePackage.writePackage('./package.json', pkg);
  }
}

exports.default = runPrepare;
