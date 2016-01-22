
'use strict';


const Router = require('koa-router');

const router = new Router({
	prefix: '/api/index'
})

router.get("/", (ctx, next) => {
	ctx.body = {
		"card": {
			"content":"<p>工作经验？工作经验能代表什么呢，打的怪物多，等级高？</p></br><p>一年的可以不比两年的差，三年的也未必比两年的好。</p></br><h4>努力，不止一两年</h4>", 
			"other":"我们选择的是优秀，追求的是卓越，而不是工作经验。So，fuck experience",
		},
		"timeline": [
			{
				done: true,
				time: new Date("2016-01-20"),
				content: "完成 Github OAuth, 你可以点击 SING IN，登陆下看看，谢谢。"
			},
			{
				done: false,
				time: new Date(),
				content: "Topic is going on"
			}
		]
	}
})

module.exports = router;