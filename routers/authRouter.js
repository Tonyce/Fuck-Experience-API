
'use strict';

const Router = require('koa-router');
const GitHubAuth = require('./GitHubAuth');

const JWT = require('../JWT');

const authRouter = new Router({
	prefix: '/api/github'
})

var githubAuth = ""

authRouter.get('/', (ctx, next) => {
	
	githubAuth = new GitHubAuth("aaabbb");
	let redirectUrl = githubAuth.redirectUrl;
	// console.log(redirectUrl);
	// let redirectUrl = "http://127.0.0.1/fuckexperience/";
	ctx.redirect(redirectUrl);
})

authRouter.get('/accessToken', async (ctx, next) => {

	let code = ctx.query.code;
	let state = ctx.query.state;

	if (state === githubAuth.state) {
		let response = await githubAuth.requestAccessToken(code);
		let info = await githubAuth.requestUserInfo(response);
		
		let infoObj = JSON.parse(info);
		
		let tokenInfo = {
			userName: infoObj.login,
			githubId: infoObj.id,
			image: infoObj.avatar_url
		}

		// console.log(tokenInfo);

		let authToken = JWT.signServerToken(tokenInfo);
		tokenInfo = JWT.verifyServerToken(authToken);
		console.log("github tokenInfo", tokenInfo);

		ctx.cookies.set("token", authToken, {
		// 	// signed: true 
			path: "/fuckexperience",
			expires: new Date().addDays(7)
		});
		ctx.body = info;
	}else {
		ctx.body = "state not match";
	}
})

module.exports = authRouter;

// if (path === '/api/github') {
// 		let redirectUrl = githubAuth.redirectUrl;
// 		ctx.redirect(redirectUrl);
// 		return;
// 	}

// 	if (path === '/api/githubAccessToken') {
// 		let code = ctx.query.code;
// 		let state = ctx.query.state;

// 		if (state === githubAuth.state) {
// 			let response = await githubAuth.requestAccessToken(code);
//   			let info = await githubAuth.requestUserInfo(response);
//   			ctx.body = info
// 		}else {
// 			ctx.body = "state not match";
// 		}
// 	}