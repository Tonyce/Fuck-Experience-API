
'use strict';


const Router = require('koa-router');

const indexRouter = new Router({
	prefix: '/api/index'
})

indexRouter.get("/", (ctx, next) => {
	ctx.body = {"content":"<h1>index card</h1>", "other":"index"}
})

module.exports = indexRouter;