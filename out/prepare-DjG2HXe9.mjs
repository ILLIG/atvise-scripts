import writePkg from 'write-pkg';
import { l as load } from './config-B5aoOFh4.mjs';
import { r as readJson } from './fs-CG3rW6X4.mjs';
import 'deepmerge';
import 'debug';
import 'write-json-file';
import './errors-D_qFVF3w.mjs';
import 'fs';

async function runPrepare({
  info,
  confirm
}) {
  const pkg = await readJson('./package.json');
  const config = await load({
    confirmFallback: confirm
  });
  const proxyUrl = `http://${config.host}:${config.port.http}`;
  if (pkg.proxy !== proxyUrl) {
    info('Updating proxy settings...');
    pkg.proxy = proxyUrl;
    writePkg('./package.json', pkg);
  }
}

export { runPrepare as default };
