const { build } = require('esbuild')
const { dependencies } = require('../package.json')

build({
  entryPoints: ['./index.js'],
  outdir: 'dist',
  bundle: true,
  external: Object.keys(dependencies),
});
