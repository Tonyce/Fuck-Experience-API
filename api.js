
'use strict';

const Koa = require('koa');
const app = new Koa();
const GitHubAuth = require('./GitHubAuth');

app.use( async (ctx, next) => {
	let path = ctx.path;
	console.log(path);
	let githubAuth = new GitHubAuth("aaabbb");

	if (path === '/api/github') {
		let redirectUrl = githubAuth.redirectUrl;
		ctx.redirect(redirectUrl);
		return;
	}

	if (path === '/api/githubAccessToken') {
		let code = ctx.query.code;
		let state = ctx.query.state;

		if (state === githubAuth.state) {
			let response = await githubAuth.requestAccessToken(code);
  			let info = await githubAuth.requestUserInfo(response);
  			ctx.body = info
		}else {
			console.log("state not match");
			ctx.body = "state not match";
		}
	}

})

app.listen(3000);