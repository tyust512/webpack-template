const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin ')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
// const PreloadWebpackPlugin = require('preload-webpack-plugin')

const common = require('./webpack.common')
const Helps = require('./helps')

module.exports = env => {
  return merge(common, {
    mode: 'production',
    output: {
      publicPath: Helps.getPublicPath(env),
      filename: 'js/[name].[contenthash:8].js',  // 影响入口chunk和optimize.runtimeChunk提取出来的部分, contenthash有利于long-term-caching 
      chunkFilename: 'js/[name].[contenthash:8].js', // 影响异步chunk, import()按需加载的那些; 但是受optimize.runtimeChunk:single等影响, 造成chunkFilename覆盖filename
      // libraryTarget: 'umd', // 打成库的时候, 需要
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader, // https://github.com/webpack-contrib/mini-css-extract-plugin
            'css-loader', // // https://github.com/webpack-contrib/css-loader
            'postcss-loader',
            'sass-loader'
          ],
        }
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            output: { // https://github.com/terser/terser#output-options
              beautify: false,
            },
            compress: {
              dead_code: true, // 配合tree-shaking
              drop_console: true,
              drop_debugger: true,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      sideEffects: true, // 让webpack识别依赖模块的package.json中的sideEffects字段或rules, TreeShake时, 可以安全地删除未用到的 export
      providedExports: true, // 让webpack从模块的export*from.. 导出代码中, 识别出可以生成更有效代码的export
      usedExports: true, // 让webpack去识别每一个模块中使用的export, 依赖于optimization.providedExports
      mergeDuplicateChunks: true,
      splitChunks: { // https://webpack.docschina.org/plugins/split-chunks-plugin/
        automaticNameDelimiter: '.',
        maxInitialRequests: 3,
        maxAsyncRequests: 5,
        cacheGroups: {
          vendor: {
            name: 'vendor', // 固定个名字,  否则名字就变成了 groupname~chunkname.contenthash.js
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            chunks: 'initial',
            priority: -10,
            minChunks: 2,
            maxSize: 1000 * 200,
            reuseExistingChunk: true,
          },
          // async: {
          //   name: true,
          //   chunks: 'async',
          //   priority: -20,
          //   reuseExistingChunk: true,
          // },
          // styles: { // 把css内容抽到1个文件中, 目前用不到
          //   chunks: 'all',
          //   test: /\.(scss|css)$/,
          //   reuseExistingChunk: true,
          //   enforce: true,
          // },
        },
      },
      runtimeChunk: { // 重命名, 并提取webpack运行时, 防止每一个entry入口里面都有webpack运行时的代码
        name: 'manifest',
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          // NODE_ENV: '"production"', // 如果mode是production, 这个变量应该是自带的
        },
      }),
      new WebpackBuildNotifierPlugin({
        title: 'build success',
        logo: path.resolve('../src/favicon.ico'),
        suppressSuccess: true,
      }),
      new CleanWebpackPlugin(), // 默认删除output.path
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css', // css文件的名字, chunkFilename底层=filename
      }),

      // 用来固定module的id, 使用路径的hash作为id, 而不是webpack自增的id; 
      // webpack默认使用后者, 文件中间插入一个新引用的module, 会导致很多module id发生变化
      new webpack.HashedModuleIdsPlugin({
        hashFunction: 'sha256',
        hashDigest: 'hex',
        hashDigestLength: 20,
      }),
      new webpack.NamedChunksPlugin() // 固定chunk id
    ],
  })
}
