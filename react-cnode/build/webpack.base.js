const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        // 使用babel编译jsx文件
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        // 使用babel编译js文件
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      }
    ]
  },
}
