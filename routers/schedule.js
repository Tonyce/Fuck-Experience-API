
'use strict';

const Router = require('koa-router');


const scheduleRouter = new Router({
	prefix: '/api/schedule'
})

scheduleRouter.get("/:id", (ctx, next) => {
	ctx.body = {
		card: {
			"content":`<h1>scheduleRouter card</h1><p>${ctx.params.id}</p>`, 
			"other":"scheduleRouter"
		}
	}
})

module.exports = scheduleRouter;