import prompts from 'prompts';
import { l as load, w as write } from './config-DUJ9yqgq.mjs';
import { A as AppError } from './errors-D_qFVF3w.mjs';
import 'deepmerge';
import 'debug';
import 'write-json-file';

async function runInit({
  info,
  doInteractive
}) {
  const existing = await load({
    fallbackToDefaults: true
  });
  const questions = [{
    type: 'text',
    name: 'host',
    message: 'On which host is your atvise server running?',
    initial: existing.host
  }, {
    type: 'number',
    name: 'portOpc',
    message: 'Which OPC-UA port is your atvise server listening at?',
    initial: existing.port.opc
  }, {
    type: 'number',
    name: 'portHttp',
    message: 'Which HTTP port is your atvise server listening at?',
    initial: existing.port.http
  }];
  const {
    host = existing.host,
    portOpc = existing.port.opc,
    portHttp = existing.port.http
  } = await doInteractive(() => prompts(questions, {
    onCancel: () => {
      throw new AppError('User cancelled');
    }
  }), {});
  const config = {
    host,
    port: {
      opc: portOpc,
      http: portHttp
    }
  };
  const {
    path
  } = await write(config);
  info(`Wrote config to '${path}'`);
}

export { runInit as default };
