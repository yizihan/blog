const webpack = require('webpack');
const path = require('path');
const _ = require('lodash');

// webpack-plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const htmlAfterWebpackPlugin = require('./htmlAfterWebpackPlugin');

// Node读取文件模块
const fs = require('fs');
// 找到views所有的文件夹
const pagesPath = path.join(__dirname, '../src/webapp/views');

// 开发入口文件
const jsEntries = {};
// 同步读取所有文件
fs.readdirSync(pagesPath).map((filename) => {
	// console.log(filename);		// common users	=> pagesPath下面的文件夹
	const _fd = pagesPath + '/' + filename;
	// 判断当前_fd是否是文件夹
	if (fs.statSync(_fd).isDirectory()) {
		// pagesPath下面的文件夹包含的文件夹
		fs.readdirSync(_fd).map((innerfilename) => {
			// console.log(innerfilename);	// users-index.entry.js
			if (/.entry.js$/.test(innerfilename)) {
				// index.entry.js ===> index
				// 利用正则将'.entry.js'去掉
				jsEntries[innerfilename.replace('.entry.js', '')] = path.join(pagesPath, filename, innerfilename);
			}
		})
	}
});
// console.log(jsEntries);		// {'users-index': 'E:/.../users-index.entry.js'}

const _modules = {
	rules: [
		{	// babel-loader
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				// 移步 .babelrc
				// options: {
				// 	presets: ['env', {
				// 		'modules': false		// webpack 执行 tree-shaking
				// 	}]
				// }
			}
		},
		{	// postcss
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [
					{loader: 'css-loader', options: { importLoaders: 1 } },
					'postcss-loader'
				]
			})
		}
	]
}

// 将Loaders克隆出来，防止叠加的时候出错
const _devLoaders = _.clone(_modules);
const _prodLoaders = _.clone(_modules);

const webpackConfig = {
	dev: {
		entry: jsEntries,
		module: _devLoaders
	},
	prod: {
		entry: jsEntries,
		module: _prodLoaders,
	}
};

module.exports =  webpackConfig;