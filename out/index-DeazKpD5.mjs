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
  run: lazyRun(() => import('./deploy-QaUIx-PU.mjs'))
};
const prepare = {
  ...prepareMetadata,
  run: lazyRun(() => import('./prepare-B8BecIMQ.mjs'))
};
const init = {
  ...initMetadata,
  run: lazyRun(() => import('./init-DFmhEbgE.mjs'))
};

var scripts = /*#__PURE__*/Object.freeze({
    __proto__: null,
    deploy: deploy,
    init: init,
    prepare: prepare
});

export { deploy as d, prepare as p, scripts as s };
