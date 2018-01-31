'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _local = require('./local');

var _local2 = _interopRequireDefault(_local);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const server = {
  'port': 80
}; // 主环境


let config = { // 根据启动项
  'viewDir': _path2.default.join(__dirname, '..', 'views'), // 模板文件
  'staticDir': _path2.default.join(__dirname, '..', 'assets'), // 静态资源文件
  'env': process.env.NODE_ENV

  // config = _.extend(config, local);

  // if(config.env == 'porduction') {
  // 	config = _.extend(config, server)
  // }

};if (config.env == 'production') {
  config = _lodash2.default.extend(config, server); // use online config
} else {
  config = _lodash2.default.extend(config, _local2.default); // use dev config
}

exports.default = config;