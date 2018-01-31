const WebpackDev = require('./config/webpack.dev');
const WebpackProd = require('./config/webpack.prod');

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