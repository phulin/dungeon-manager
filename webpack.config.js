/* eslint-disable node/no-unpublished-require */
const path = require('path');
const { DefinePlugin, ProvidePlugin } = require('webpack');

// TODO: Use browser target for client file.

module.exports = {
  entry: {
    DungeonManager: './src/client.ts',
    clan_basement: './src/server.ts',
  },
  mode: 'development',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'build', 'relay'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    fallback: {
      assert: false,
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules(?!\/(libram|buffer))/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_DEBUG': false,
      'process.env.NODE_ENV': "'development'",
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      console: path.resolve(path.join(__dirname, 'src/console')),
    }),
  ],
  externals: {
    kolmafia: 'commonjs kolmafia',
  },
};
