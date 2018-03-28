const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HTMLPlugin = require('html-webpack-plugin')

// 判断当前环境是否是开发环境
const isDev = process.env.NODE_ENV === 'development'

config = {
	// 定义依赖入口
	entry: {
		app: path.join(__dirname, '../client/app.js')
	},
	// 打包完输出
	output: {
		filename: '[name].[hash:5].js',
		path: path.join(__dirname, '../dist'),
		publicPath: '/public'
		// 此选项指定在浏览器中所引用的 => http://localhost:3333/public/app.ebaa7.js
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
	},
	plugins: [
		// process.cwd() => ./ 返回当前目录（绝对路径）
		// 使用rimraf代替
		// new CleanWebpackPlugin(['dist'], {root: process.cwd()}),
		// 生成HTML页面，并且在Webpack编译的时候，把生成的文件引入到生成的HTML中
		// 使用/client/template.html为模板，生成index.html
		new HTMLPlugin({
			template: path.join(__dirname, '../client/template.html')
		})
	]
}

if(isDev) {
	// "dev:client": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.client.js",
	// NODE_ENV=development => 手动设置环境变量
	config.devServer = {
		host: '0.0.0.0',
		port: '9000',
		contentBase: path.join(__dirname, '../dist'),
		// 热加载
		// hot: true,		// => [HMR] Hot Module Replacement is disabled.
		// 显示错误信息
		overlay: {
			errors: true
		},
		publicPath: '/public/', // 为了配合output.publicPath
		historyApiFallback: {
			index: '/public/index.html'
		}
	}
	// Project is running at http://0.0.0.0:8888/
	// webpack output is served from /public
	// Content not from webpack is served from E:\Imooc\blog\react-cnode\dist
	// 404s will fallback to /public/index.html
}

module.exports = config