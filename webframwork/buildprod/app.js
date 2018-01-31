'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var path = _interopDefault(require('path'));
var serve = _interopDefault(require('koa-static'));
var koaSimpleRouter = _interopDefault(require('koa-simple-router'));
var co = _interopDefault(require('co'));
var render = _interopDefault(require('koa-swig'));
var log4js = _interopDefault(require('log4js'));
var _ = _interopDefault(require('lodash'));
var awilix = require('awilix');
var awilixKoa = require('awilix-koa');

const ErrorHandler = {
	error (app, logger) {
		app.use(async(ctx, next) => {
			try {
				await next();
			} catch (err) {
				ctx.status = err.status || 500;
				ctx.body = 500;
			}
		});
		app.use(async (ctx, next) => {
			await next();
			if(ctx.status != 404) return;
			logger.error('没有找到地址');		// 将错误输出到log文件
			ctx.status = 404;
			ctx.body = 404;
		});
	}
};

// 开发环境配置
const localConfig = {
	'port': 8081
};

// 主环境
const server = {
  'port': 80
};

let config = {	// 根据启动项
	'viewDir': path.join(__dirname, '..','views'),		// 模板文件
	'staticDir': path.join(__dirname, '..','assets'),	// 静态资源文件
  'env': "production"
};

// config = _.extend(config, local);

// if(config.env == 'porduction') {
// 	config = _.extend(config, server)
// }

if (config.env == 'production') {
  config = _.extend(config, server);		// use online config
} else {
  config = _.extend(config, localConfig);		// use dev config
}

var config$1 = config;

// import InitController from './controllers/InitController';		// 普通的文件引入被awilix替代

// 引入awilix 构建IOC
// import TestService from './models/TestService';

const app = new Koa();

// koa-static 设置静态资源池 改变下面资源的引用方式
// <link rel="stylesheet" href="/styles/index.css">
app.use(serve(config$1.staticDir));

// koa-swig 模板渲染设置 => render()
// PS: 异步的 使用async/await
app.context.render = co.wrap(render({
	root: config$1.viewDir,		// 模板文件目录
	autoescape: true,
	cache: 'memory',
	ext: 'html',
	writeBody: false
}));



// 创建IOC容器 =============
const container = awilix.createContainer();

// 将TestService以类的形式注入到container
// 省略掉手工注入过程
// container.register({
// 	testService: asClass(TestService)
// });

// 注册服务 =============
// 将所有的service注册到容器里  就不用每个都import了  注意文件名大写，文件名对应的即是类名
container.loadModules(['models/*.js'], {
	formatName: 'camelCase',			// 设置引入类的名称格式 驼峰
	registrationOptions: {		
		register: awilix.asClass,					// 以Class的形式注入
		lifetime: awilix.Lifetime.SCOPED		// 设置缓存
	}
});
// for(var key in container) {
// 	console.log(container[key]);		这里可以找到所有注册进container的内容
// }


// 向路由中添加服务 =============
// 将所有注入到container的内容 服务于每个request路由请求
// 其他地方都可以使用container的内容
app.use(awilixKoa.scopePerRequest(container));


// ==========================================
// log4js容错
log4js.configure({
	appenders: {yd: {type: 'file', filename: './logs/yd.log'}},
	categories: {default: {appenders: ['yd'], level: 'error'}}
});
const logger = log4js.getLogger('yd');
ErrorHandler.error(app, logger);
// ========================================== //

// Old ============= 初始化路由 调用getAllRouters()
// InitController.getAllRouters(app, router);	

// 批量导入路由 =============
// 注册所有router 将IndexController.js引入
app.use(awilixKoa.loadControllers('controllers/*.js', { cwd: __dirname }));
// 此时将根据页面路由的请求 => 调用相应的服务 => 异步的获取数据


// 监听配置文件内的端口号
app.listen(config$1.port, () => {
	console.log('Successful Setups');
});
