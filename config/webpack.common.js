const path = require('path')
const webpack = require('webpack')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const Helps = require('./helps')

const pages = [
  {
    entry: {
      index: path.resolve(__dirname, '../src/js/index.js'),
    },
    template: path.resolve(__dirname, '../src/index.html'),
    filename: 'index.html',
    title: '',

  },
  {
    entry: {
      test: path.resolve(__dirname, '../src/js/test.js'),
    },
    template: path.resolve(__dirname, '../src/test.html'),
    filename: 'test.html',
    title: '',
  }
]

const helps = new Helps(pages)

module.exports = {
  entry: helps.getEntry(),
  resolve: { // 配置模块如何被解析
    alias: { // 简化import / require路径, 设置别名
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['.js', '.ts', '.tsx', 'json'],
    modules: [path.resolve(__dirname, '../node_modules')],
  },
  externals: {
    // 把某些库标记为从外部引入, 可以通过script引进来, 使用cdn等网络脚本, 它不打包进bundle中
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 1000 * 1000 * 5, // 5M
    maxAssetSize: 1000 * 1000 * 1,
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        include: path.resolve(__dirname, '../src'), 
        exclude: /node_modules/, 
        use: 'babel-loader?cacheDirectory',
      },
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, '../src'), 
        exclude: /node_modules/, 
        use: [
          'babel-loader?cacheDirectory',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: false,
            },
          }
        ],
      },
      // https://github.com/webpack-contrib/css-loader
      {
        test: /\.(sa|sc|c)ss$/, // 开发环境下只能使用style-loader
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },
      {
        // pictures
        test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader', // https://github.com/webpack-contrib/file-loader
                options: {
                  name: '[name].[contenthash:8].[ext]',
                  outputPath: 'images',
                },
              },
            },
          }, 
          {
            loader: 'image-webpack-loader', // 图片压缩, https://github.com/tcoopman/image-webpack-loader
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.80],
                speed: 4,
              },
              svgo: {
                enabled: true,
              },
              gifsicle: {
                interlaced: false,
              },
              // WEBP把jpg/png转成webp, 但是呢ie11不支持webp, 故注释掉
              // webp: {
              //   quality: 75,
              // },
            },
          }
        ],
      },
      {
        // vedio
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: '[name].[contenthash:8].[ext]',
                  outputPath: 'media',
                },
              },
            },
          }
        ],
      },
      {
        // 字体
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: '[name].[contenthash:8].[ext]',
                  outputPath: 'fonts',
                },
              },
            },
          }
        ],
      }
      // {
      //   test: /\.pug$/,
      //   oneOf: [
      //     /* config.module.rule('pug').oneOf('pug-template') */
      //     {
      //       use: [
      //         /* config.module.rule('pug').oneOf('pug-template').use('raw') */
      //         {
      //           loader: 'raw-loader',
      //         },
      //         /* config.module.rule('pug').oneOf('pug-template').use('pug-plain') */
      //         {
      //           loader: 'pug-plain-loader',
      //         }
      //       ],
      //     }
      //   ],
      // }
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.ProvidePlugin({ // 自动加载模块，而不必到处 import 或 require; 相当于一个全局变量形式
      // _$: 'jquery',
    }),
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
      // handler(percentage, message, ...args) {
      //   console.info('进度: %s, 消息: %s, 参数: %s', percentage, message, [...args].join(' | '))
      // },
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../dist'),
        ignore: ['index.html'],
        toType: 'dir',
        force: true,
      }
    ]),
    ...helps.getHtmlWebpackConfig(),
    ...helps.getPreloadWebpackConfig()
  ],
}
