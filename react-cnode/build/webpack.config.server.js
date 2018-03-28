const path = require('path')

module.exports = {
	// webpack打包出来的内容是运行在node环境
	target: 'node',
	// 定义依赖入口
	entry: {
		app: path.join(__dirname, '../client/server.entry.js')
	},
	// 打包完输出
	output: {
		filename: 'server-entry.js',
		path: path.join(__dirname, '../dist'),
		publicPath: '',
		libraryTarget: 'commonjs2'
	},
	module: {
		rules: [
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
	}
}