
'use strict';

const Router = require('koa-router');


const router = new Router({
	prefix: '/api/topic'
})

router.get("/", (ctx, next) => {
	ctx.body = {
		card: {
			"content":"<h1>Topic card</h1>", 
			"other":"Topic"
		}
	}
})

module.exports = router;