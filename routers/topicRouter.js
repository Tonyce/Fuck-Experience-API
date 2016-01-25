
'use strict';

const Router = require('koa-router');
const Topic = require('../model/Topic');


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

router.post('/new', async ctx => {
	let body = await parserBody(ctx.req);
	// console.log(body);
	body = JSON.parse(body)
	let result = "";
	if (body && body.title && body.content) {
		let topic = new Topic(null, body.title, body.content);
		try {
			await topic.save();
		}catch (err){
			result = {
				err: err
			}
		}
		result = {
			ok: "ok"
		}
	}else {
		result = {
			err: "body is null"
		};
	}
	ctx.body = result
})

module.exports = router;

function parserBody (req) {
	
	// console.log(`HEADERS: ${JSON.stringify(req.headers)}`);
	let promise = new Promise( (resolve, reject) => {    
		let body = "";
		req.setEncoding('utf8');
		req.on('data', (chunk) => {
			body += chunk;
		});
		req.on('end', () => {
			// console.log('No more data in response.')
			// console.log("body", body)
			resolve(body);
		})
		req.on('error', (e) => {
			reject(e);
		})
	})
	return promise
}