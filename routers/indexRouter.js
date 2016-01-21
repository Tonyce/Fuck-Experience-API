
'use strict';


const Router = require('koa-router');

const indexRouter = new Router({
	prefix: '/api/index'
})

indexRouter.get("/", (ctx, next) => {
	ctx.body = {
		"card": {
			"content":"<p>工作经验？工作经验能代表什么呢，打的怪等多，等级数高？</p></br><p>一年的可以不比两年的差，三年的也未必比两年的好。</p></br><h3>努力，不止一两年</h3>", 
			"other":"我们选择的是优秀，最求的是卓越，而不是工作经验。",
		},
		"timeline": [
			{
				done: true,
				time: new Date(),
				content: "完成 Github OAuth"
			},
			{
				done: false,
				time: new Date(),
				content: "完成 Github OAuth"
			},
			{
				done: false,
				time: new Date(),
				content: "完成 Github OAuth"
			}
		]
	}
})

module.exports = indexRouter;