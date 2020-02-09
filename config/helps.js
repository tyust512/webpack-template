const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')

class Helps {
  constructor(pages=[]) {
    this.pages = pages
    this.entry = {}
    

    this.htmlPluginList  = []
    this.preloadPluginList = []

    this.generateHtmlConfig()
    this.generatePreloadConfig()
  }
  
  // 获取几个环境下, 对应的publicPath
  static getPublicPath (env) {
    const projectName = '项目名称, 需要自己改'
    const { SERVER_ENV } = env

    let url = '/'
    switch (SERVER_ENV) {
      case 'test': // 测试环境
        url = '这需要根据测试环境的部署路径, 自己改'
        break
      case 'pre': // 预发环境
        url = `https://mee-test-oss.s3.cn-north-1.jdcloud-oss.com/assets/${projectName}/`
        break
      case 'production': // 正式环境
        url = `https://cdn.minecraft.education.jdcloud.com/assets/${projectName}/`
        break
      default:
        url = '/'
    }

    return url
  }

  generateHtmlConfig() {
    this.pages.forEach(page => {
      const entryList = []

      for (let entryName in page.entry) {
        if (page.entry[entryName]) {
          this.entry[entryName] = page.entry[entryName]
          entryList.push(entryName)
        }
      }
      
      const {filename, favicon, title, template} = page

      if (entryList.length > 0) {
        const htmlConfig = {
          filename: filename || 'index.html',
          favicon: favicon || path.resolve(__dirname, '../src/favicon.ico'), // 图标
          template: template || path.resolve(__dirname, '../src/index.html'),
          title: title || 'index',
          chunks: entryList.concat(['manifest', 'vendor', 'common']) || [], // 把其他的分离出来的chunk一起引进来
          inject: true,
          minify: {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          },
          chunksSortMode: 'dependency',
        }
        this.htmlPluginList.push(new HtmlWebpackPlugin(htmlConfig))
      }

    })
  }
  // 只对单页面生效
  generatePreloadConfig() {
    if (this.pages.length > 1) {
      return 
    }
    const preloadPLugin = new PreloadWebpackPlugin( // https://github.com/googlechromelabs/preload-webpack-plugin
      {
        rel: 'preload', // 碰到了就预加载, 但不执行
        include: 'initial',
      }
    )
    const prefetchPLugin = new PreloadWebpackPlugin(
      {
        rel: 'prefetch', // 空闲的时候去下载
        include: 'asyncChunks',
      }
    )

    this.preloadPluginList.push(preloadPLugin, prefetchPLugin)
  }

  getEntry(){
    return this.entry || {}
  }
  getHtmlWebpackConfig() {
    return this.htmlPluginList || []
  }
  getPreloadWebpackConfig() {
    return this.preloadPluginList || []
  }
  
}

module.exports = Helps