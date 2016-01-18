
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
		// return;
	}

	// return next();
})

// app.use(async (ctx, next) => {
//   try {
//     await next() // next is now a function
//   } catch (err) {
//     ctx.body = { message: err.message }
//     ctx.status = err.status || 500
//   }
// })


// app.use(async ctx => {
//   const user = await User.getById(ctx.session.userid) // await instead of yield
//   ctx.body = user // ctx instead of this
// })

// response

// app.use(ctx => {
// 	ctx.body = 'Hello World';
// });

app.listen(3000);


// const logger = async (context, next) => {
//   const start = new Date;
//   await next();
//   const ms = new Date - start;
//   console.log(`${context.method} ${context.url} - ${ms}ms`);
// }

// const index = (context) => {
//   context.body = 'Hello World';
// }

// app.use(logger);
// app.use(index);

// app.listen(3000);
// console.info(`The app is listening on port 3000`);
