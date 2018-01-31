### 目录
```
src
 └─webapp
     ├─views            // 视图
     │  ├─common        // 公共资源
     │  └─users     
     │      └─pages
     └─widgets          // 组件
         └─top
```

### 入口文件
```
// webpack.config.js
const WebpackDev = require('./config/webpack.dev');
const WebpackProd = require('./config/webpack.prod');

// 根据环境变量选择相应配置项
switch (process.env.NODE_ENV) {
	case 'development':
		module.exports = WebpackDev;
		break;
	case 'production':
		module.exports = WebpackProd;
		break;
	default:
		module.exports = WebpackDev;
}
```
### 初始化的webpack配置文件 webapck.basic.js
```
// config/webpack.basic.js
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
				// 		'modules': false // webpack 执行 tree-shaking
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
```

### 开发环境的webpack配置文件 webpack.dev.js
```
// webpack.dev.js
const webpack = require('webpack');
const basic = require('./webpack.basic');
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
		path: path.join(__dirname, '../builddev/assets'),
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
		// 直接复制模板文件 
		new CopyWebpackPlugin([
				{from: 'src/webapp/views/common/layout.html', to: '../views/common/layout.html'},
				{from: 'src/webapp/widgets/top/top.html', to: '../widgets/top/top.html'}
		]),
		// 根据模板生成html文件
		new HtmlWebpackPlugin({
			// 将webapp/内的资源输出到builddev/views里面
			filename: '../views/users/index.html',								// 输出地址和名称
			template: 'src/webapp/views/users/pages/index.html',	// 模板地址
			inject: false
		}),
		// 自定义plugin 更换模板中的links和scripts
		new htmlAfterWebpackPlugin()
	]
}

// 将dev自定义选项覆盖basic默认选项
const _options = _.merge(basic.dev, options);

// 导出所有配置项
module.exports = _options;
```


### better-npm-run
```
// package.json
"scripts": {
    "webpack:dev": "better-npm-run webpack:dev",
    "webpack:prod": "better-npm-run webpack:prod"
},
"betterScripts": {
    "webpack:dev": {
      "command": "webpack --process --color",
      "env": {
        "NODE_ENV": "development"
      }
    },
    "webpack:prod": {
      "command": "webpack --process --color",
      "env": {
        "NODE_ENV": "production"
      }
    },
},
```
