const { builtinModules } = require('module');
const resolve = require('@rollup/plugin-node-resolve').default;
const typescript = require('@rollup/plugin-typescript');
const babel = require('@rollup/plugin-babel').default;
const addShebang = require('rollup-plugin-add-shebang');
const { dependencies } = require('./package.json');

module.exports = {
  input: ['./src/index.ts', './src/bin.ts'],
  external: [
    ...builtinModules,
    ...Object.keys(dependencies),
    'atscm/api',
    '../package.json',
  ],
  plugins: [resolve(), typescript(), babel({ extensions: ['.ts', '.js'] }), addShebang()],
  output: [
    {
      dir: './out',
      format: 'cjs',
    },
    {
      dir: './out',
      format: 'es',
      entryFileNames: '[name].mjs',
      chunkFileNames: '[name]-[hash].mjs',
    },
  ],
};
