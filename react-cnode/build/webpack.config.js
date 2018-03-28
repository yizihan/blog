const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
	// 定义依赖入口
	entry: {
		app: path.join(__dirname, '../client/app.js')
	},
	// 打包完输出
	output: {
		filename: '[name].[hash:5].js',
		path: path.join(__dirname, '../dist'),
		publicPath: ''
	},
	module: {
		rules: [
			{
				// 使用babel编译jsx文件
				test: '/.jsx$/',
				loader: 'babel-loader'
			},
			{
				// 使用babel编译js文件
				test: '/.js$/',
				loader: 'babel-loader',
				exclude: [
					path.join(__dirname, '../node_modules')
				]
			}
		]
	},
	plugins: [
		// process.cwd() => ./ 返回当前目录（绝对路径）
		new CleanWebpackPlugin(['dist'], {root: process.cwd()}),
		// 生成HTML页面，并且在Webpack编译的时候，把生成的文件引入到生成的HTML中
		new HTMLPlugin()
	]
}