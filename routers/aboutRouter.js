
'use strict';

const Router = require('koa-router');


const aboutRouter = new Router({
	prefix: '/api/about'
})

aboutRouter.get("/", (ctx, next) => {
	ctx.body = {
		card: {
			"content":"<h1>aboutRouter card</h1>", 
			"other":"about"
		}
	}
})

module.exports = aboutRouter;