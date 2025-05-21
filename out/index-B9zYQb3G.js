'use strict';

const name$2 = 'deploy';
const description$2 = 'Deploy build files to atvise server';

var deployMetadata = /*#__PURE__*/Object.freeze({
    __proto__: null,
    description: description$2,
    name: name$2
});

const name$1 = 'prepare';
const description$1 = 'Prepare project for atvise-scripts';

var prepareMetadata = /*#__PURE__*/Object.freeze({
    __proto__: null,
    description: description$1,
    name: name$1
});

const name = 'init';
const description = 'Setup a project for atvise-scripts';

var initMetadata = /*#__PURE__*/Object.freeze({
    __proto__: null,
    description: description,
    name: name
});

const lazyRun = importRun => async options => {
  const {
    default: run
  } = await importRun();
  return run(options);
};
const deploy = {
  ...deployMetadata,
  run: lazyRun(() => Promise.resolve().then(function () { return require('./deploy-BYUk-O6x.js'); }))
};
const prepare = {
  ...prepareMetadata,
  run: lazyRun(() => Promise.resolve().then(function () { return require('./prepare-Ih4uRe1i.js'); }))
};
const init = {
  ...initMetadata,
  run: lazyRun(() => Promise.resolve().then(function () { return require('./init-C-x5DaXx.js'); }))
};

var scripts = /*#__PURE__*/Object.freeze({
    __proto__: null,
    deploy: deploy,
    init: init,
    prepare: prepare
});

exports.deploy = deploy;
exports.prepare = prepare;
exports.scripts = scripts;
