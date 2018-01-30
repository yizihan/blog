const webpack = require('webpack')

module.exports = {
	entry: './script.js',
	output: {
		filename: './dist/bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.js?/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			}
		]
	}
}