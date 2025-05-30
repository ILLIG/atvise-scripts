const name = 'deploy';
const description = 'Deploy build files to atvise server';

var deployMetadata = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name,
    description: description
});

const name$1 = 'prepare';
const description$1 = 'Prepare project for atvise-scripts';

var prepareMetadata = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$1,
    description: description$1
});

const name$2 = 'init';
const description$2 = 'Setup a project for atvise-scripts';

var initMetadata = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$2,
    description: description$2
});

const lazyRun = importRun => async options => {
  const {
    default: run
  } = await importRun();
  return run(options);
};
const deploy = {
  ...deployMetadata,
  run: lazyRun(() => import('./deploy-3c6a46dc.mjs'))
};
const prepare = {
  ...prepareMetadata,
  run: lazyRun(() => import('./prepare-4c5e2bd9.mjs'))
};
const init = {
  ...initMetadata,
  run: lazyRun(() => import('./init-df56f545.mjs'))
};

var scripts = /*#__PURE__*/Object.freeze({
    __proto__: null,
    deploy: deploy,
    prepare: prepare,
    init: init
});

export { deploy as d, prepare as p, scripts as s };
