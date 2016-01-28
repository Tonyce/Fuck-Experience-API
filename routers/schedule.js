
'use strict';

const Router = require('koa-router');


const scheduleRouter = new Router({
	prefix: '/api/schedule'
})

scheduleRouter.get("/:id", (ctx, next) => {
	let id = ctx.params.id;
	let cardWord = scheduleWord(id);
	ctx.body = {
		card: cardWord,
		items: [
				{
					id: "aaaaaaaá",
					content: id,
					done: true
				},
				{
					id: "bbbbbbbb",
					content: ` false ${id}`,
					done: false
				}
			]
	}
})

module.exports = scheduleRouter;


function scheduleWord (day) {
	let cardWord = {}
	switch (day) {
		case "0" : 
			cardWord = {
				"content": "<h2>周天，给自己一个放松，给自己一点休息</h2><h3>也给自己一个总结，也给自己一个新的开始</h3>", 
				"other": "将本周计划及完成发到我的邮箱"
			}
			break;
		case "1" :
			cardWord = {
				"content": "<h2>今天，做你想做！</h2><h3>工作不只是薪水，成长不止于工作</h3>", 
				"other":"照顾好自己的计划"
			}
			break;
		case "2" :
			cardWord = {
				"content": "<h2></h2><h3>也给自己一个总结，也给自己一个新的开始</h3>",
				"other":"计划了就要做"
			}
			break;
		case "3" :
			cardWord = {
				"content": "<h2>奋力，奋战</h2><h3>这周已过去一半</h3>", 
				"other":"慢慢完成自己的计划"
			}
			break;
		case "4" :
			cardWord = {
				"content": "<h2>痛，累？</h2><h3>恭喜，你还活着!</h3>", 
				"other":"一步步总是好的"
			}
			break;
		case "5" :
			cardWord = {
				"content": "<h2>总结下工作，给工作个美丽的收尾</h2><h3>约上()朋友，或花前，或酒地</h3>", 
				"other":"完成的就是自己的进步"
			}
			break;
		case "6" :
			cardWord = {
				"content": "<h2>周六，放纵下自己，懒床，不刷牙，不洗脸，熬夜到凌晨。。。</h2><h3>也允许自己充电...</h3>", 
				"other":"脚印证明了你的痕迹"
			}
			break;
	}
	return cardWord
}