const path = require('path')

module.exports = {
	// 定义依赖入口
	entry: {
		app: path.join(__dirname, '../client/app.js')
	},
	// 打包完输出
	output: {
		filename: '[name].[hash:5].js',
		path: path.join(__dirname, '../dist'),
		publicPath: '/public'
	}
}