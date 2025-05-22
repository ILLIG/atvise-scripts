import { join, extname } from 'path';
import { promises } from 'fs';
import readdirp from 'readdirp';
import { DataType } from 'node-opcua';
import setupDebug from 'debug';
import { l as load } from './config-B5aoOFh4.mjs';
import { r as readJson } from './fs-CG3rW6X4.mjs';
import 'deepmerge';
import 'write-json-file';
import './errors-D_qFVF3w.mjs';

const debug = setupDebug('deploy');
let atscm;
let atscmApi;
const resourceId = path => new atscm.NodeId(join('ns=1;s=SYSTEM.LIBRARY.PROJECT.RESOURCES', path));
class PathCreator {
  created = new Set();
  async ensurePath(path) {
    let current;
    for (const part of path.split('/').slice(0, -1)) {
      current = current ? join(current, part) : part;
      if (!this.created.has(current)) {
        const nodeId = resourceId(current);
        await atscmApi.createNode(nodeId, {
          name: part,
          nodeClass: NodeClass.Object,
          typeDefinition: 61,
          value: {}
        });
        debug(`Created folder '${current}'`);
        this.created.add(current);
      }
    }
  }
}
var ResourceType;
(function (ResourceType) {
  ResourceType["Svg"] = "VariableTypes.ATVISE.Resource.Svg";
})(ResourceType || (ResourceType = {}));
const typeDefinifions = new Map([['.css', 'VariableTypes.ATVISE.Resource.Css'], ['.ico', 'VariableTypes.ATVISE.Resource.Icon'], ['.html', 'VariableTypes.ATVISE.Resource.Html'], ['.htm', 'VariableTypes.ATVISE.Resource.Html'], ['.png', 'VariableTypes.ATVISE.Resource.Png'], ['.js', 'VariableTypes.ATVISE.Resource.Javascript'], ['.txt', 'VariableTypes.ATVISE.Resource.Text'],
// ['.svg', 'VariableTypes.ATVISE.Resource.OctetStream'],
['.svg', ResourceType.Svg],
// FIXME: Remove
['.json', 'VariableTypes.ATVISE.Resource.OctetStream'], ['.map', 'VariableTypes.ATVISE.Resource.OctetStream']]);
function getTypeDefinition(path) {
  const extension = extname(path);
  const match = typeDefinifions.get(extension);
  if (!match) {
    return 'VariableTypes.ATVISE.Resource.OctetStream';
  }
  return match;
}
async function deployFile(entry, remotePath, {
  warn
}) {
  const nodeId = resourceId(remotePath);
  const typeDefinition = getTypeDefinition(entry.path);
  const value = {
    dataType: DataType.ByteString,
    value: await promises.readFile(entry.fullPath)
  };
  const result = await atscmApi.createNode(nodeId, {
    name: entry.basename,
    typeDefinition,
    value
  });
  const [{
    value: createdNode
  }] = result.outputArguments[3].value;
  if (!createdNode) {
    debug(`'${nodeId}' already exists, overwriting...`);
    await atscmApi.writeNode(nodeId, value);
  }
  debug(`Deployed '${nodeId}'`);
}
async function runDeploy({
  progress,
  warn,
  confirm = () => false,
  info
}) {
  const config = await load({
    confirmFallback: confirm
  });
  process.env.ATSCM_CONFIG_PATH = join(__dirname, '../Atviseproject.js');
  // Patch atscm config
  process.env.ATSCM_PROJECT__PORT__OPC = `${config.port.opc}`;
  process.env.ATSCM_PROJECT__HOST = `${config.host}`;
  if (config.login) {
    process.env.ATSCM_PROJECT__LOGIN__USERNAME = config.login.username;
    process.env.ATSCM_PROJECT__LOGIN__PASSWORD = config.login.password;
    info(`deploy with login - user: ${process.env.ATSCM_PROJECT__LOGIN__USERNAME}`);
  }
  atscm = await import('atscm');
  atscmApi = await import('atscm/api');
  // Resolve remote base path from 'homepage' field in package.json
  const pkg = await readJson('./package.json');
  let baseURL = new URL(`http://${config.host}:${config.port.http}`);
  if (pkg.homepage) {
    baseURL = new URL(pkg.homepage, baseURL);
    info(`Deploying to resource directory '.${baseURL.pathname}'`);
  }
  const base = baseURL.pathname;
  // Find and deploy files
  const paths = new PathCreator();
  let count = 0;
  let args = process.argv.slice(2);
  const ignoredPaths = [];
  const pathOnly = [];
  console.log("");
  if (args.includes("all")) {
    console.log(">>> deploymentConfig: deployAll");
  } else if (args.includes("configOnly")) {
    console.log(">>> deploymentConfig: configOnly (only config folder)");
    pathOnly.push("config");
  } else if (args.includes("codeOnly")) {
    ignoredPaths.push("config");
    console.log(">>> deploymentConfig: codeOnly (exclude config folder)");
  } else {
    ignoredPaths.push(...["assets", "licenses"]);
    console.log(">>> deploymentConfig: default (exclude assets/licenses folder)");
  }
  for (const root of config.deploy.outPath) {
    for await (const entry of readdirp(root)) {
      if (ignoredPaths.some(ignoredPath => entry.path.startsWith(ignoredPath))) {
        continue;
      }
      if (pathOnly.length > 0 && !pathOnly.some(optionPath => entry.path.startsWith(optionPath))) {
        continue;
      }
      const remotePath = join(base, entry.path);
      await paths.ensurePath(remotePath);
      await deployFile(entry, remotePath, {
        warn
      });
      progress === null || progress === void 0 ? void 0 : progress(`Uploaded ${++count} files`);
    }
  }
  progress === null || progress === void 0 ? void 0 : progress(`Uploaded ${count} files 🎉`);
  info(`
  You can view you deployment at ${baseURL}
`);
}

export { PathCreator, runDeploy as default, deployFile, getTypeDefinition, resourceId };
