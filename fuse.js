const {
  FuseBox,
  EnvPlugin,
  SVGPlugin,
  CSSPlugin,
  BabelPlugin,
  QuantumPlugin,
  WebIndexPlugin,
  JSONPlugin,
  Sparky
} = require('fuse-box');

let fuse, app, vendor, isProduction;

Sparky.task('config', () => {
  fuse = new FuseBox({
    homeDir: 'src/',
    sourceMaps: !isProduction,
    hash: isProduction,
    target: 'browser',
    output: 'dist/$name.js',
    useTypescriptCompiler: true,
    experimentalFeatures: true,
    plugins: [
      EnvPlugin({ NODE_ENV: isProduction ? 'production' : 'development' }),
      JSONPlugin(),
      SVGPlugin(),
      CSSPlugin(),
      WebIndexPlugin({
        template: 'src/index.html'
      }),
      isProduction &&
        QuantumPlugin({
          treeshake: true,
          uglify: true
        })
    ]
  });
  // vendor
  vendor = fuse.bundle('vendor').instructions('~ index.tsx');

  // bundle app
  app = fuse.bundle('app').instructions('> [index.tsx]');
});

Sparky.task('default', ['clean', 'config'], () => {
  fuse.dev();
  // add dev instructions
  app.watch().hmr();
  return fuse.run();
});

Sparky.task('clean', () => Sparky.src('dist/').clean('dist/'));
Sparky.task('prod-env', ['clean'], () => {
  isProduction = true;
});
Sparky.task('dist', ['prod-env', 'config'], () => {
  Sparky.src('src/favicon.ico').dest('dist/'); // TODO fix favicon
  return fuse.run();
});
