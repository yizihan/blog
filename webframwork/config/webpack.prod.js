const webpack = require('webpack');
const conf = require('./webpack.config');
const path = require('path');
const _ = require('lodash');

// webpack-plugins
// 将所有入口chunk中引用的*.css，移动到独立分离的CSS文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 生成HTML文件，可以自定义模板和输出路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Copy layout.html 模板文件
const CopyWebpackPlugin = require('copy-webpack-plugin');
const htmlAfterWebpackPlugin = require('./htmlAfterWebpackPlugin');

const options = {
	output: {
		path: path.join(__dirname, '../buildprod/assets'),
		publicPath: '/',		// 将来上线的地址 cdn/a.js
		filename: 'scripts/[name]-[hash:5].bundle.js'
	},
	plugins: [
		// 抽离CSS文件
		new ExtractTextPlugin('styles/[name]-[hash:5].css'),
		// 抽离共用代码
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'scripts/[name]-[hash:5].bundle.js',
			minChunks: 2
		}),
		// new UglifyJsPlugin({
		// 	uglifyOptions: {
		// 		ie8: false,
		// 		ecma: 8,
		// 		parse: {...},
		// 		output: {
		// 			comments: false,
		// 			beautify: false,
		// 			...
		// 		},
		// 		compress: {...},
		// 		warning: false
		// 	},
		// 	cache: true,
		// 	parallel: os.cpus().length * 2
		// }),
		
		// 直接复制模板文件 
		new CopyWebpackPlugin([
				{from: 'src/webapp/views/common/layout.html', to: '../views/common/layout.html'},
				{from: 'src/webapp/widgets/top/top.html', to: '../widgets/top/top.html'}
		]),
		// 根据模板生成html文件
		new HtmlWebpackPlugin({
			// 将webapp/内的资源输出到buildprod/views里面
			filename: '../views/users/index.html',								// 输出地址和名称
			template: 'src/webapp/views/users/pages/index.html',	// 模板地址
			inject: false
		}),
		// 自定义plugin 更换模板中的links和scripts
		new htmlAfterWebpackPlugin()
	]
}

// 将dev自定义选项覆盖basic默认选项
const _options = _.merge(conf.prod, options);

// 导出所有配置项
module.exports = _options;