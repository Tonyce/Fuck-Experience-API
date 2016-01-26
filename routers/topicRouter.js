
'use strict';

const Router = require('koa-router');
const Topic = require('../model/Topic');
const TopicAnswer = require('../model/TopicAnswer');

const JWT = require('../JWT');

const router = new Router({
	prefix: '/api/topic'
})

router.get("/", async (ctx, next) => {
	let lastId = ctx.query.id;
	ctx.body = await Topic.findTitles(lastId)
})

router.get('/:id', async ctx => {
	let id = ctx.params.id;
	try {
		id = new _ObjectID(id);
	}catch (err) {
		ctx.body = {
			id: ctx.params.id,
			content: "# error"
		}	
		return;
	}
	let topic = new Topic(id)
	await topic.find();
	topic.answers = await TopicAnswer.find(topic._id);
	// console.log(topic);
	ctx.body = topic;
})

router.post('/new', async ctx => {
	let cookieObj = ctx.cookieObj;
	// console.log("cookieObj", cookieObj);
	let authToken = cookieObj.token;
	let tokenInfo = JWT.verifyServerToken(authToken);
	let body = await parserBody(ctx.req);
	// console.log("body", body);
	if (!tokenInfo) {
		ctx.body = result = {
			err: "没有授权"
		};
		return;
	}
	let author = {
		githubId: tokenInfo.githubId,
		name: tokenInfo.userName,
		image: tokenInfo.image
	}

	body = JSON.parse(body)
	let result = "";
	if (body && body.title && body.content) {
		let topic = new Topic(null, body.title, author, body.content);
		try {
			await topic.save();
		}catch (err){
			result = { err: err }
		}
		result = { ok: "ok" }
	}else {
		result = { err: "body is null" }
	}
	ctx.body = result
})

router.post('/answer', async ctx => {
	let cookieObj = ctx.cookieObj;
	let authToken = cookieObj.token;
	let tokenInfo = JWT.verifyServerToken(authToken);
	let body = await parserBody(ctx.req);
	if (!tokenInfo) {
		ctx.body = result = {
			err: "没有授权"
		};
		return;
	}

	let answeror = {
		githubId: tokenInfo.githubId,
		name: tokenInfo.userName,
		image: tokenInfo.image
	}

	
	let result = "";
	body = JSON.parse(body);
	let topicId = body.topicId;
		topicId = new _ObjectID(topicId);
	let toUser = body.toUser;
	let content = body.content;
	let isAt = body.isAt;
	let topicAnswer = new TopicAnswer(null, topicId, answeror, toUser, content, isAt )

	try {
		await topicAnswer.save();
	}catch (err) {
		ctx.body = {err: "失败"}
		return
	}
	ctx.body = {ok: "ok"}
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