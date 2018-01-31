// import IndexModel from '../models/IndexModel';

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
import { route, GET, POST, before } from 'awilix-koa';

// 装饰器 decorator
@route('/users')    // /users路由
export default class UserAPI {
  constructor ({userService}) {
    this.userService = userService
  }
  @route('/:id')    // /users/:id路由
  @GET()
  async getUser(ctx) {
    // 从 /models/UserService.js 中获取数据
    const result = await this.userService.get(ctx.params.id);   // 将路由中的:id传给 /models/UserService.js
    console.log(result);
    ctx.body = await ctx.render('users/index', {data: result});       // 使用index.html渲染页面，并将参数传入
  }
}