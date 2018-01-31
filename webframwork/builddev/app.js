'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaSimpleRouter = require('koa-simple-router');

var _koaSimpleRouter2 = _interopRequireDefault(_koaSimpleRouter);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _koaSwig = require('koa-swig');

var _koaSwig2 = _interopRequireDefault(_koaSwig);

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _ErrorHandler = require('./middlewares/ErrorHandler');

var _ErrorHandler2 = _interopRequireDefault(_ErrorHandler);

var _main = require('./config/main');

var _main2 = _interopRequireDefault(_main);

var _awilix = require('awilix');

var _awilixKoa = require('awilix-koa');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import TestService from './models/TestService';

// import InitController from './controllers/InitController';		// 普通的文件引入被awilix替代

// 引入awilix 构建IOC
const app = new _koa2.default();

// koa-static 设置静态资源池 改变下面资源的引用方式
// <link rel="stylesheet" href="/styles/index.css">
app.use((0, _koaStatic2.default)(_main2.default.staticDir));

// koa-swig 模板渲染设置 => render()
// PS: 异步的 使用async/await
app.context.render = _co2.default.wrap((0, _koaSwig2.default)({
	root: _main2.default.viewDir, // 模板文件目录
	autoescape: true,
	cache: 'memory',
	ext: 'html',
	writeBody: false
}));

// 创建IOC容器 =============
const container = (0, _awilix.createContainer)();

// 将TestService以类的形式注入到container
// 省略掉手工注入过程
// container.register({
// 	testService: asClass(TestService)
// });

// 注册服务 =============
// 将所有的service注册到容器里  就不用每个都import了  注意文件名大写，文件名对应的即是类名
container.loadModules(['models/*.js'], {
	formatName: 'camelCase', // 设置引入类的名称格式 驼峰
	registrationOptions: {
		register: _awilix.asClass, // 以Class的形式注入
		lifetime: _awilix.Lifetime.SCOPED // 设置缓存
	}
});
// for(var key in container) {
// 	console.log(container[key]);		这里可以找到所有注册进container的内容
// }


// 向路由中添加服务 =============
// 将所有注入到container的内容 服务于每个request路由请求
// 其他地方都可以使用container的内容
app.use((0, _awilixKoa.scopePerRequest)(container));

// ==========================================
// log4js容错
_log4js2.default.configure({
	appenders: { yd: { type: 'file', filename: './logs/yd.log' } },
	categories: { default: { appenders: ['yd'], level: 'error' } }
});
const logger = _log4js2.default.getLogger('yd');
_ErrorHandler2.default.error(app, logger);
// ========================================== //

// Old ============= 初始化路由 调用getAllRouters()
// InitController.getAllRouters(app, router);	

// 批量导入路由 =============
// 注册所有router 将IndexController.js引入
app.use((0, _awilixKoa.loadControllers)('controllers/*.js', { cwd: __dirname }));
// 此时将根据页面路由的请求 => 调用相应的服务 => 异步的获取数据


// 监听配置文件内的端口号
app.listen(_main2.default.port, () => {
	console.log('Successful Setups');
});