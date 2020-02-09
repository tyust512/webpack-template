# webpack-template

本项目只是因工作中需要, 自己搭建的简单`demo `版项目, 希望对新手学习或项目搭建有帮助.

目前使用webpack v4版本搭建, 可以手动配置成单个页面或多页面; 如果您需要使用vue, 请使用官方的vue-cli脚手架搭建项目, 只是需要自己定制化配置`vue.config.js`; 

如果有更好的建议或疑问, 可以微信我: tyust512, 很乐意结识新朋友; 同时欢迎大家`star`以资鼓励



## 功能介绍

1. 样式只支持`sass, css`; 启用了`autoprefixer`的`autoprefix`功能, 自动添加浏览器前缀
2. 目前只支持`js`, 暂没支持`TS`;  使用了`eslint`去规范代码; 
3. 图片支持除`webp`以外的格式, 我们项目需要支持IE, so webp 就没用上
4. html模板暂时使用的是`ejs`, 后续打算上`pug`
5. `script`脚本支持`localhost / 线上test / 线上`几个环境, 区别在于本地换地环境没有``CDN``, 而线上有且配置的域名地址不同

## 性能

1. 小图片支持`base64`, 所有图片根据类型不同, 进行60%-90%的压缩
2. `js / css / html`都支持**代码合并压缩**
3. 支持`import()`动态引入和`tree shaking`
4. 支持`preload`和`prefetch`特性
5. 支持`DNS prefetch`
6. 所有的`module`和`bundle`都进行了`hash`固定, 更改单个文件的代码, 只影响特定的小范围
7. 静态资源支持上`CDN`

## 启动

```
npm run serve // 本地开发
npm run buildtest 	// 线上测试环境
npm run buildpre 	// 线上预发环境
npm run build		// 线上灰度环境, 功能上也同等于线上正式环境
```



## 兼容性

1. 启用了`babel`的`@babel/preset-env`, 自动根据`package.json`中`browserslist`中配置, 自动启用相应的`babel`插件

## 注意事项

1. 打包出来的代码, 兼容到IE11, 如果要兼容IE10及其以下, 需要解决打包压缩省略字符导致的IE语法错误, 具体请自己搜
