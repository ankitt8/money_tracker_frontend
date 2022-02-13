const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
let mode = 'development';
if (process.env.NODE_ENV === 'production') {
  mode = 'production';
}

module.exports = {
  mode: mode,
  entry: path.resolve(__dirname, './src/index.tsx'),
  ...(mode === 'development') && {
    devtool: "cheap-module-source-map",
    devServer: {
      hot: true,
      port: 3000,
      liveReload: false,
      compress: false
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './build')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      pages: path.resolve(__dirname, 'src/pages'),
      Constants: path.resolve(__dirname, 'src/Constants'),
      helper: path.resolve(__dirname, 'src/helper'),
      actions: path.resolve(__dirname, 'src/actions'),
      reducers: path.resolve(__dirname, 'src/reducers'),
      styles: path.resolve(__dirname, 'src/styles'),
      customHooks: path.resolve(__dirname, 'src/customHooks'),
      'api-services': path.resolve(__dirname, 'src/api-services')
    }
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    }),
    mode === 'development' && new ReactRefreshWebpackPlugin()
  ].filter(Boolean)
};
