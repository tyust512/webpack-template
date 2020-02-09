// https://babeljs.io/docs/en/options
module.exports = {
  comments: true, // 需要设置为true, 否则懒加载import()的chunkname注释就被忽略了
  presets: [
    [
      '@babel/preset-env', // https://babeljs.io/docs/en/babel-preset-env
      {
        modules: false, // 禁止modules语法被转换, 为了tree shake 功能的正常使用
        debug: true,
        useBuiltIns: 'usage', // 智能识别 status 4的js api  https://babeljs.io/docs/en/babel-preset-env#usebuiltins-usage
        corejs: { // 为了引入proposal polyfill https://babeljs.io/docs/en/babel-preset-env#corejs
          version: 3,
          proposals: true,
        },
        shippedProposals: true,
      }
    ],
    [
      '@babel/preset-typescript'
    ]
  ],
  plugins: [
    [ 
      '@babel/plugin-transform-runtime' // 使用默认配置就可以; https://babeljs.io/docs/en/babel-plugin-transform-runtime
    ]
  ],
}

    // // Stage 1
    // '@babel/plugin-proposal-export-default-from',
    // '@babel/plugin-proposal-logical-assignment-operators',
    // ['@babel/plugin-proposal-optional-chaining', { 'loose': false }],
    // ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }],

    // // Stage 2
    // ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    // '@babel/plugin-proposal-function-sent',
    // '@babel/plugin-proposal-export-namespace-from',

    // // Stage 3
    // '@babel/plugin-syntax-dynamic-import',
    // ['@babel/plugin-proposal-class-properties', { 'loose': true }],