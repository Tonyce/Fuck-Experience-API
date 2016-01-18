
'use strict';

const Koa = require('koa');
const app = new Koa();
const GitHubAuth = require('./GitHubAuth');


app.use( (ctx, next) => {
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
			githubAuth.requestAccessToken(code, (err, data) => {
				// console.log(err, data)
				// ctx.body = err ? err : data;
				ctx.body = "data"
			});
			// ctx.body = "out data"
		}else {
			console.log("state not match");
			ctx.body = "state not match";
		}
		return;
	}

	return next();
})

// response

app.use(ctx => {
	ctx.body = 'Hello World';
});

app.listen(3000);
