![BFF](https://dn-cnode.qbox.me/FgW3yn3utI7DnCZJBFk8h_5QLW6o)

BFF全称是Backends For Frontends(服务于前端的后端)

## 技术栈

- gulp、gulp-babel、gulp-watch、gulp-rollup 打包Node中间层
- webpack 打包管理静态资源文件
- koa2 
- koa-swig 模板引擎
- awilix [依赖注入](https://github.com/yizihan/Library/issues/3)
- log4js [日志管理](https://github.com/yizihan/Library/issues/4)

## nodeuii中间层(Koa)
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

链接：[nodeuii.md](https://github.com/yizihan/Library/blob/master/webframwork/nodeuii.md)


## webapp显示层
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

链接：[webapp.md](https://github.com/yizihan/Library/blob/master/webframwork/webapp.md)


## Final Run
同时打包运行两个层

```
npm run build
```
```
"scripts": {
  "build:dev": "npm run webpack:dev && npm run server:dev",
  "build": "npm run webpack:prod && npm run server:prod",
  "server:dev": "cross-env NODE_ENV=development gulp",
  "server:prod": "cross-env NODE_ENV=production gulp",
  "webpack:dev": "better-npm-run webpack:dev",
  "webpack:prod": "better-npm-run webpack:prod"
},
```
