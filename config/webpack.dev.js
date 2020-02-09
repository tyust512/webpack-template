const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  output: { // dev模式只能使用hash, 不能用chunkhash和contenthash, 启动报错
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash:8].js',  
    chunkFilename: 'js/[name].[hash:8].js',
  },
  mode: 'development',
  devtool: 'inline-source-map', // 'eval-source-map',
  devServer: {
    port: 9000,
    contentBase: path.resolve(__dirname, '../dist'),
    compress: true,
    historyApiFallback: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    disableHostCheck: true,
    index: 'index.html',
    open: true,
    hot: true,
    openPage: 'index',
  },
  plugins: [
    new webpack.DefinePlugin({}), 
    new webpack.HotModuleReplacementPlugin()
  ],
})
