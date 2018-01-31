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
}

export default ErrorHandler;