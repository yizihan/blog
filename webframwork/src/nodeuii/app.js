import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import router from 'koa-simple-router';

import co from 'co';
import render from 'koa-swig';

import log4js from 'log4js';
import ErrorHandler from './middlewares/ErrorHandler';

import config from './config/main';
// import InitController from './controllers/InitController';		// 普通的文件引入被awilix替代

// 引入awilix 构建IOC
import { createContainer, asClass, Lifetime } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-koa';
// import TestService from './models/TestService';

const app = new Koa();

// koa-static 设置静态资源池 改变下面资源的引用方式
// <link rel="stylesheet" href="/styles/index.css">
app.use(serve(config.staticDir));

// koa-swig 模板渲染设置 => render()
// PS: 异步的 使用async/await
app.context.render = co.wrap(render({
	root: config.viewDir,		// 模板文件目录
	autoescape: true,
	cache: 'memory',
	ext: 'html',
	writeBody: false
}));



// 创建IOC容器 =============
const container = createContainer();

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
		register: asClass,					// 以Class的形式注入
		lifetime: Lifetime.SCOPED		// 设置缓存
	}
});
// for(var key in container) {
// 	console.log(container[key]);		这里可以找到所有注册进container的内容
// }


// 向路由中添加服务 =============
// 将所有注入到container的内容 服务于每个request路由请求
// 其他地方都可以使用container的内容
app.use(scopePerRequest(container));


// ==========================================
// log4js容错
log4js.configure({
	appenders: {yd: {type: 'file', filename: './logs/yd.log'}},
	categories: {default: {appenders: ['yd'], level: 'error'}}
});
const logger = log4js.getLogger('yd')
ErrorHandler.error(app, logger);
// ========================================== //

// Old ============= 初始化路由 调用getAllRouters()
// InitController.getAllRouters(app, router);	

// 批量导入路由 =============
// 注册所有router 将IndexController.js引入
app.use(loadControllers('controllers/*.js', { cwd: __dirname }));
// 此时将根据页面路由的请求 => 调用相应的服务 => 异步的获取数据


// 监听配置文件内的端口号
app.listen(config.port, () => {
	console.log('Successful Setups')
});
