import { join, extname } from 'path';
import { promises as fsp } from 'fs';
import readdirp from 'readdirp';
import { DataType, NodeClass } from 'node-opcua';
import setupDebug from 'debug';
import type * as Atscm from 'atscm';
import { load } from '../../lib/config';
import type { ScriptRunnerOptions } from '..';
import { readJson } from '../../lib/fs';
import { EntryInfo } from 'readdirp';

const debug = setupDebug('deploy');
const AtscmApi = require('atscm/api');

let atscm: typeof Atscm;
let atscmApi: typeof AtscmApi;

export const resourceId = (path: string) =>
  new atscm.NodeId(join('ns=1;s=SYSTEM.LIBRARY.PROJECT.RESOURCES', path));

export class PathCreator {
  created = new Set<string>();

  async ensurePath(path: string) {
    let current: string | undefined;

    for (const part of path.split('/').slice(0, -1)) {
      current = current ? join(current, part) : part;

      if (!this.created.has(current)) {
        const nodeId = resourceId(current);

        await atscmApi.createNode(nodeId, {
          name: part,
          nodeClass: NodeClass.Object,
          typeDefinition: 61,
          value: {},
        });

        debug(`Created folder '${current}'`);

        this.created.add(current);
      }
    }
  }
}

enum ResourceType {
  Svg = 'VariableTypes.ATVISE.Resource.Svg',
}

const typeDefinifions = new Map<string, string>([
  ['.css', 'VariableTypes.ATVISE.Resource.Css'],
  ['.ico', 'VariableTypes.ATVISE.Resource.Icon'],
  ['.html', 'VariableTypes.ATVISE.Resource.Html'],
  ['.htm', 'VariableTypes.ATVISE.Resource.Html'],
  ['.png', 'VariableTypes.ATVISE.Resource.Png'],
  ['.js', 'VariableTypes.ATVISE.Resource.Javascript'],
  ['.txt', 'VariableTypes.ATVISE.Resource.Text'],
  // ['.svg', 'VariableTypes.ATVISE.Resource.OctetStream'],
  ['.svg', ResourceType.Svg],
  // FIXME: Remove
  ['.json', 'VariableTypes.ATVISE.Resource.OctetStream'],
  ['.map', 'VariableTypes.ATVISE.Resource.OctetStream'],
]);

export function getTypeDefinition(path: string) {
  const extension = extname(path);
  const match = typeDefinifions.get(extension);

  if (!match) {
    return 'VariableTypes.ATVISE.Resource.OctetStream';
  }

  return match;
}

export async function deployFile(
  entry: EntryInfo,
  remotePath: string,
  { warn }: { warn: ScriptRunnerOptions['warn'] }
) {
  const nodeId = resourceId(remotePath);
  const typeDefinition = getTypeDefinition(entry.path);
  const value = {
    dataType: DataType.ByteString,
    value: await fsp.readFile(entry.fullPath),
  };

  const result = await atscmApi.createNode(nodeId, {
    name: entry.basename,
    typeDefinition,
    value,
  });
  const [{ value: createdNode }] = result.outputArguments[3].value;

  if (!createdNode) {
    debug(`'${nodeId}' already exists, overwriting...`);
    await atscmApi.writeNode(nodeId, value);
  }

  debug(`Deployed '${nodeId}'`);
}

export default async function runDeploy({
  progress,
  warn,
  confirm = () => false,
  info,
}: ScriptRunnerOptions) {
  const config = await load({ confirmFallback: confirm });

  process.env.ATSCM_CONFIG_PATH = join(__dirname, '../Atviseproject.js');

  // Patch atscm config
  process.env.ATSCM_PROJECT__PORT__OPC = `${config.port.opc}`;
  process.env.ATSCM_PROJECT__HOST = `${config.host}`;

  if (config.login?.isLoggedIn) {
    process.env.ATSCM_PROJECT__LOGIN__USERNAME = config.login.username;
    process.env.ATSCM_PROJECT__LOGIN__PASSWORD = config.login.password;

    info(`deploy with login - user: ${process.env.ATSCM_PROJECT__LOGIN__USERNAME}`);
  }

  atscm = await require('atscm');
  atscmApi = await require('atscm/api');

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
      await deployFile(entry, remotePath, { warn });

      progress?.(`Uploaded ${++count} files`);
    }
  }

  progress?.(`Uploaded ${count} files 🎉`);
  info(`
  You can view you deployment at ${baseURL}
`);
}
