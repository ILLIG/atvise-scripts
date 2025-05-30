import merge from 'deepmerge';
import setupDebug from 'debug';
import { writeJsonFile } from 'write-json-file';
import { A as AppError } from './errors-D_qFVF3w.mjs';

const debug = setupDebug('config');
const defaults = {
  host: 'localhost',
  port: {
    opc: 4840,
    http: 80
  },
  deploy: {
    outPath: ['out', 'build']
  },
  login: {
    isLoggedIn: false,
    username: "",
    password: ""
  }
};
function normalize(atviserc) {
  const deployOutPath = atviserc.deploy.outPath;
  return {
    ...atviserc,
    deploy: {
      ...atviserc.deploy,
      outPath: Array.isArray(deployOutPath) ? deployOutPath : [deployOutPath]
    }
  };
}
const configName = '.atviserc.json';
const schemaUrl = 'https://atvise.github.io/create-atvise-app/schemas/atviserc.schema.json';
async function load({
  dir = process.cwd(),
  name = configName,
  path = `${dir}/${name}`,
  fallbackToDefaults = false,
  confirmFallback
} = {}) {
  let raw;
  try {
    raw = await import(path);
    debug(`Loaded config from '${path}'`);
  } catch (error) {
    if (fallbackToDefaults || (await (confirmFallback === null || confirmFallback === void 0 ? void 0 : confirmFallback('Failed to load config file, do you want to continue with defaults?')))) return defaults;
    if (error instanceof Error) {
      throw AppError.from(error, 'Failed to load config file', {
        tips: ["Run 'npx atvise-scripts init' first"]
      });
    } else {
      throw AppError.from(new Error(String(error)), 'Failed to load config file', {
        tips: ["Run 'npx atvise-scripts init' first"]
      });
    }
  }
  return normalize(merge(defaults, raw));
}
async function write(atviserc, {
  dir = process.cwd(),
  name = configName,
  path = `${dir}/${name}`
} = {}) {
  await writeJsonFile(configName, {
    $schema: schemaUrl,
    ...atviserc
  });
  debug(`Wrote config to '${path}'`);
  return {
    path
  };
}

export { load as l, write as w };
