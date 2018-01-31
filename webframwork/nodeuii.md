### 目录
```
src
 └─nodeuii
    ├─assets        // 静态资源
    ├─config        // 配置项，端口/环境变量
    ├─controllers   // 控制器
    ├─middlewares   // 中间件
    ├─models        // 数据
    ├─views         // 模板
    └─app.js        // 入口文件
```
### 入口文件
```
// app.js
import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import router from 'koa-simple-router';

// 模板引擎 - Swig
import co from 'co';
import render from 'koa-swig';

// 错误日志 - log4js
import log4js from 'log4js';
import ErrorHandler from './middlewares/ErrorHandler';      // 中间件

// 配置项
import config from './config/main';
// import InitController from './controllers/InitController';   // 普通的文件引入被awilix替代

// 引入awilix 构建IOC
import { createContainer, asClass, Lifetime } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-koa';

const app = new Koa();

// koa-static 设置静态资源池 改变下面资源的引用方式
// <link rel="stylesheet" href="/styles/index.css">
app.use(serve(config.staticDir));                   // from config/main.js

// koa-swig 模板渲染设置 => render()
// PS: 异步的 使用async/await
app.context.render = co.wrap(render({
    root: config.viewDir,       // 模板文件目录     // from config/main.js
    autoescape: true,
    cache: 'memory',
    ext: 'html',
    writeBody: false
}));


// 创建IOC容器 =============
const container = createContainer();

// import TestService from './models/TestService';  // 普通的文件引入被awilix.loadModules替代
// 将TestService以类的形式注入到container
// 省略掉手工注入过程
// container.register({
//  testService: asClass(TestService)
// });

// 注册服务 =============
// 将所有的service注册到容器里  就不用每个都import了  注意文件名大写，文件名对应的即是类名
container.loadModules(['models/*.js'], {
    formatName: 'camelCase',            // 设置引入类的名称格式 驼峰
    registrationOptions: {      
        register: asClass,              // 以Class的形式注入
        lifetime: Lifetime.SCOPED       // 设置缓存
    }
});

// for(var key in container) {
//  console.log(container[key]);        // 这里可以找到所有注册进container的内容
// }


// 向路由中添加服务 =============
// 将所有注入到container的内容 服务于每个request路由请求
// 其他地方都可以使用container的内容
app.use(scopePerRequest(container));


// ========================================== //
// log4js容错
log4js.configure({
    appenders: {logerror: {type: 'file', filename: './logs/logerror.log'}},
    categories: {default: {appenders: ['logerror'], level: 'error'}}
});
const logger = log4js.getLogger('logerror')
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
```
---

## 使用Gulp打包Node中间层
```
// gulpfile.js
const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const rollup = require('gulp-rollup');
// process.env.NODE_ENV 判断
const replace = require('rollup-plugin-replace');

// 开发环境
gulp.task('builddev', () => {
  // watch所有JS文件的变动
  return watch('./src/nodeuii/**/*.js', {
    ignoreInitial: false
  }, () => {
    gulp.src('./src/nodeuii/**/*.js')
      .pipe(babel({ // 执行babel
        babelrc: false, // 不使用.babelrc文件中的配置
        'plugins': [
          'transform-decorators-legacy',
          'transform-es2015-modules-commonjs'
        ]
      }))
      .pipe(gulp.dest('./builddev/')) // 编译输出
  })
});

// 上线环境
// babel编译
gulp.task('buildbabel', () => {
  gulp.src('./src/nodeuii/**/*.js')
      .pipe(babel({
        babelrc: false,
        'ignore': ['./src/nodeuii/app.js'],
        'plugins': ['transform-es2015-modules-commonjs']
      }))
      .pipe(gulp.dest('./buildprod/'))
});

// 流清洗
gulp.task('buildreplace', () => {
  gulp.src('./src/nodeuii/**/*.js')
      .pipe(rollup({    // 使用rollup，将dev用的代码清除 => 流清洗
        input: ['./src/nodeuii/app.js'],
        format: 'cjs',
        'plugins': [
          replace({
            'process.env.NODE_ENV': JSON.stringify('production')
          })
        ]
      }))
      .pipe(gulp.dest('./buildprod/'))
});

// 判断是否是上线环境
// const _flag = (process.env.NODE_ENV == 'production');

let build = ['builddev'];
if (process.env.NODE_ENV == 'production') {
  build = ['buildbabel', 'buildreplace']
}

// 根据NODE_ENV的值来判断运行哪个task
gulp.task('default', build)

// package.json
"scripts": {
  "server:dev": "cross-env NODE_ENV=development gulp",      // 开发环境  
  "server:prod": "cross-env NODE_ENV=production gulp"       // 上线环境
}
```
