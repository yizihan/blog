// 主环境
import path from 'path';
import _ from 'lodash';
import local from './local';

const server = {
  'port': 80
}

let config = {	// 根据启动项
	'viewDir': path.join(__dirname, '..','views'),		// 模板文件
	'staticDir': path.join(__dirname, '..','assets'),	// 静态资源文件
  'env': process.env.NODE_ENV
}

// config = _.extend(config, local);

// if(config.env == 'porduction') {
// 	config = _.extend(config, server)
// }

if (config.env == 'production') {
  config = _.extend(config, server)		// use online config
} else {
  config = _.extend(config, local)		// use dev config
}

export default config;