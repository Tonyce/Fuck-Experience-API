
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
	topic.collection = ""
	ctx.body = topic;
})

router.post('/new', async ctx => {
	let cookieObj = ctx.cookieObj;
	let authToken = cookieObj.token;
	let tokenInfo = JWT.verifyServerToken(authToken);
	
	if (!tokenInfo) {
		ctx.body = {
			err: "没有授权"
		};
		return;
	}
	let author = {
		githubId: tokenInfo.githubId,
		name: tokenInfo.userName,
		image: tokenInfo.image
	}

	let result = "";
	let body = ctx.reqBody ? JSON.parse(ctx.reqBody) : {}
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
	
	if (!tokenInfo) {
		ctx.body = {
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
	let body = ctx.reqBody ? JSON.parse(ctx.reqBody) : {}
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
