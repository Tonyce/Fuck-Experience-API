
'use strict';

const Router = require('koa-router');


const router = new Router({
	prefix: '/api/topic'
})

router.get("/", (ctx, next) => {
	// console.log(ctx.query);
	let lastId = ctx.query.id;
	if (lastId) {

	}else {
		
	}
	ctx.body =  [
			{
				id: 2,
				title: "工作经验，只是说你老了而已",
				authorName:"Tonyce",
				time: new Date()
			},
			{
				id: 3,
				title: "比起工作经验，更好的是努力",
				authorName:"Tonyce",
				time: new Date()
			},
			{
				id: 4,
				title: "工作经验其实一文不值",
				authorName:"Tonyce",
				time: new Date()
			}
		]
})

router.get('/:id', ctx => {
	
	ctx.body = {
		id: "dsfa",
		content: `<h1>Topic ${ctx.params.id}</h1>Topic`,
		time: "fadfa"
	}	
})

module.exports = router;