'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _class, _desc, _value, _class2; // import IndexModel from '../models/IndexModel';

// class IndexController {
//   constructor(ctx) {
//     this.ctx = ctx;
//   }
//   render() {
//     return async(ctx, next) => {
//       const indexModelIns = new IndexModel();				// 从IndexModel中获取数据
//       const result = await indexModelIns.getData();	// await 执行promise操作
//       ctx.body = await ctx.render('index', {data: result});	// 向views/index.html页面输出数据
//     }
//   }
// }

// export default IndexController;


// ============= Update =============


var _awilixKoa = require('awilix-koa');

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

// /users路由


// 装饰器 decorator
let UserAPI = (_dec = (0, _awilixKoa.route)('/users'), _dec2 = (0, _awilixKoa.route)('/:id'), _dec3 = (0, _awilixKoa.GET)(), _dec(_class = (_class2 = class UserAPI {
  constructor({ userService }) {
    this.userService = userService;
  }

  async getUser(ctx) {
    // 从 /models/UserService.js 中获取数据
    const result = await this.userService.get(ctx.params.id); // 将路由中的:id传给 /models/UserService.js
    console.log(result);
    ctx.body = await ctx.render('users/index', { data: result }); // 使用index.html渲染页面，并将参数传入
  }
}, (_applyDecoratedDescriptor(_class2.prototype, 'getUser', [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'getUser'), _class2.prototype)), _class2)) || _class);
exports.default = UserAPI;