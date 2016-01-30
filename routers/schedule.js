
'use strict';

const Router = require('koa-router');
const JWT = require('../JWT');

const Schedule = require('../model/Schedule');

const scheduleRouter = new Router({
	prefix: '/api/schedule'
})

scheduleRouter.get("/:weekNum/:day", async (ctx, next) => {
	let cookieObj = ctx.cookieObj;
	let authToken = cookieObj.token;
	let tokenInfo = JWT.verifyServerToken(authToken)

	let cardWord = scheduleWord(day);
	
	if ( !tokenInfo ) {
		ctx.body = {
			card: cardWord,	
			items: []
		}
		return
	}

	let year = new Date().getFullYear();
	let weekNum = ctx.params.weekNum;
		weekNum = Number(weekNum);
	let day = ctx.params.day;
		day = Number(day)
	let githubId = tokenInfo.githubId;
	// console.log(weekNum, day);
	// console.log(tokenInfo)

	
	let items = await Schedule.findItems(githubId, day, weekNum, year)
	ctx.body = {
		card: cardWord,
		items: items
	}
})

scheduleRouter.post("/:weekNum/:day", async (ctx, next) => {
	let cookieObj = ctx.cookieObj;
	let authToken = cookieObj.token;
	let tokenInfo = JWT.verifyServerToken(authToken)

	if ( !tokenInfo ) {
		ctx.body = {
			card: cardWord,	
			items: []
		}
		return
	}

	// console.log(ctx.reqBody)

	let body = ctx.reqBody ? JSON.parse(ctx.reqBody) : {}
	let content = body.content;

	let year = new Date().getFullYear();
	let weekNum = ctx.params.weekNum;
		weekNum = Number(weekNum);
	let day = ctx.params.day;
		day = Number(day);
	let githubId = tokenInfo.githubId;
	// console.log(weekNum, day);
	// console.log(tokenInfo);

	let schedule = new Schedule(null, githubId, day, weekNum, year, content);

	// let cardWord = scheduleWord(day);
	// let items = await Schedule.findItems(githubId, day, weekNum, year)
	await schedule.save();
	// console.log(schedule);
	ctx.body = {
		"_id": schedule._id
	};
})

scheduleRouter.put("/:id", async (ctx, next) => {
	let cookieObj = ctx.cookieObj;
	let authToken = cookieObj.token;
	let tokenInfo = JWT.verifyServerToken(authToken)

	if ( !tokenInfo ) {
		ctx.body = {}
		return
	}

	let id = ctx.params.id;
	let githubId = tokenInfo.githubId;
	
	id = new _ObjectID(id);
	let schedule = new Schedule(id, githubId);

	let body = ctx.reqBody ? JSON.parse(ctx.reqBody) : {}
	let done = body.done;
	let result = await schedule.update({done: done});
	ctx.body = {
		"ok":  result.result.ok
	};
})


scheduleRouter.delete("/:id", async (ctx, next) => {
	let cookieObj = ctx.cookieObj;
	let authToken = cookieObj.token;
	let tokenInfo = JWT.verifyServerToken(authToken)

	if ( !tokenInfo ) {
		ctx.body = {}
		return
	}

	let id = ctx.params.id;
	let githubId = tokenInfo.githubId;

	id = new _ObjectID(id);
	let schedule = new Schedule(id, githubId);
	let result = await schedule.deleteItem();
	// console.log(result);
	ctx.body = {
		"ok": result.result.ok
	}
})


module.exports = scheduleRouter;


function scheduleWord (day) {
	let cardWord = {}
	switch (day) {
		case 0 : 
			cardWord = {
				"content": "<h2>周天，给自己一个放松，给自己一点休息</h2><h3>也给自己一个总结，也给自己一个新的开始</h3>", 
				"other": "将本周计划及完成发到我的邮箱"
			}
			break;
		case 1 :
			cardWord = {
				"content": "<h2>今天，做你想做！</h2><h3>工作不只是薪水，成长不止于工作</h3>", 
				"other":"照顾好自己的计划"
			}
			break;
		case 2 :
			cardWord = {
				"content": "<h2></h2><h3>也给自己一个总结，也给自己一个新的开始</h3>",
				"other":"计划了就要做"
			}
			break;
		case 3 :
			cardWord = {
				"content": "<h2>奋力，奋战</h2><h3>这周已过去一半</h3>", 
				"other":"慢慢完成自己的计划"
			}
			break;
		case 4 :
			cardWord = {
				"content": "<h2>痛，累？</h2><h3>恭喜，你还活着!</h3>", 
				"other":"一步步总是好的"
			}
			break;
		case 5 :
			cardWord = {
				"content": "<h2>总结下工作，做个美丽的收尾</h2><h3>约上()朋友，或花前，或酒地</h3>", 
				"other":"完成的就是自己的进步"
			}
			break;
		case 6 :
			cardWord = {
				"content": "<h2>周六，放纵下自己，懒床，不刷牙，不洗脸，熬夜到凌晨。。。</h2><h3>也允许自己充电...</h3>", 
				"other":"脚印证明了你的痕迹"
			}
			break;
	}
	return cardWord
}