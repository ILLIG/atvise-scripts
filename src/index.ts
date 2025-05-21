import * as scripts from './scripts';

const scriptRunner = (script: scripts.Script) => (
  options?: Partial<scripts.ScriptRunnerOptions>
) => {
  const defaultDoInteractive: scripts.ScriptRunnerOptions['doInteractive'] = (fn, fallback) => fallback;

  return script.run({
    info: console.info,
    warn: console.warn,
    doInteractive: options?.doInteractive ?? defaultDoInteractive,
    ...options,
  } as scripts.ScriptRunnerOptions);
};

export const deploy = scriptRunner(scripts.deploy);
export const prepare = scriptRunner(scripts.prepare);
