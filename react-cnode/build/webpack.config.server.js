const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

module.exports = webpackMerge(baseConfig, {
  // webpack打包出来的内容是运行在node环境
  target: 'node',
  // 定义依赖入口
  entry: {
    app: path.join(__dirname, '../client/server.entry.js')
  },
  // 打包完输出
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  }
})
