var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
  //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
  devtool: 'cheap-module-eval-map',
  /*entry: [      
    'webpack-hot-middleware/client?reload=true',
    APP_PATH +'/novelsForm.js'
  ],*/
  entry: [
    APP_PATH + '/novels.js'
  ],
  //输出的文件名 合并以后的js会命名为 main.js
  output: {
    path: BUILD_PATH,
    filename: '[name].js',
    publicPath: '/static/'
  },
  module: {
    // loaders 則是放欲使用的 loaders，在這邊是使用 babel-loader 將所有 .js（這邊用到正則式）相關檔案（排除了 npm 安裝的套件位置 node_modules）轉譯成瀏覽器可以閱讀的 JavaScript。preset 則是使用的 babel 轉譯規則，這邊使用 react、es2015。若是已經單獨使用 .babelrc 作為 presets 設定的話，則可以省略 query
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader'
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }/*{
        test: /\.css$/, // Only .css files
        loader: 'style!css' // Run both loaders
      } 這語法會出錯 BREAKING CHANGE: It's no longer allowed to omit the '-loader' suffix when using loaders.
                 You need to specify 'style-loader' instead of 'style',
                 see https://webpack.js.org/guides/migrating/#automatic-loader-module-name-extension-removed*/
    ],
  },
  //添加我们的插件 会自动生成一个html文件
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Hello World app',
      template: 'build/index.ejs'
    }),
    //new webpack.HotModuleReplacementPlugin()
  ]
};