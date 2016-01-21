
'use strict';

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');

const JWT = require('./JWT');
const GitHubAuth = require('./routers/GitHubAuth');
 
const authRouter = require('./routers/authRouter');
const indexRouter = require('./routers/indexRouter');
const aboutRouter = require('./routers/aboutRouter');
const scheduleRouter = require('./routers/schedule');


const login = new Router({
	prefix: '/api'
})

login.get("/login", ctx => {
	let cookieObj = parseCookie(ctx.headers.cookie);
	
	// console.log("cookieObj", cookieObj);

	let authToken = cookieObj.token;
	let tokenInfo = JWT.verifyServerToken(authToken);
	if (!tokenInfo) {
		ctx.body = {
			login: false
		}
		return
	}
	// console.log("tokenInfo", tokenInfo);
	authToken = JWT.signServerToken(tokenInfo);
	if (!authToken) {
		ctx.body = {"error": "server signServerToken error"}
	}else {
		ctx.cookies.set("token", authToken, {
			// signed: true 
			path: "/fuckexperience",
			expires: new Date().addDays(7)
		})
		ctx.body = {
			login: true,
			userName: tokenInfo.userName,
			image: tokenInfo.image
		}	
	}
})

login.get("/logout", ctx => {
	ctx.cookies.set("token", "",  {
		// signed: true 
		path: "/fuckexperience",
		expires: new Date()
	});
	ctx.body = {
		login: false
	}
})


login.get("/selfinfo", async (ctx) => {
	let cookieObj = parseCookie(ctx.headers.cookie);
	
	// console.log("cookieObj", cookieObj);

	let authToken = cookieObj.token;
	let tokenInfo = JWT.verifyServerToken(authToken);

	console.log(tokenInfo);

	let code = tokenInfo.code;
	let state = tokenInfo.state;

	// let githubAuth = new GitHubAuth(state);
	// let response = await githubAuth.requestAccessToken(code);
	// let info = await githubAuth.requestUserInfo(response);

	// console.log(info)

	ctx.body = {
		login: tokenInfo.userName,
		id: tokenInfo.githubId,
		avatar_url: tokenInfo.image
	}
})

//login
app.use(login.routes())
   .use(login.allowedMethods());

//index
app.use(indexRouter.routes())
   .use(indexRouter.allowedMethods());


//about
app.use(aboutRouter.routes())
   .use(aboutRouter.allowedMethods());

app.use(scheduleRouter.routes())
   .use(scheduleRouter.allowedMethods());

// auth
app.use(authRouter.routes())
   .use(authRouter.allowedMethods());


app.listen(3000);


function parserBody (req) {
	let body = ""
	console.log(`HEADERS: ${JSON.stringify(req.headers)}`);
	let promise = new Promise( (resolve, reject) => {    
		req.setEncoding('utf8');
		req.on('data', (chunk) => {
		// console.log(`BODY: ${chunk}`);
			body =+ chunk;
		});
		req.on('end', () => {
			// console.log('No more data in response.')
			resolve(body);
		})
		req.on('error', (e) => {
			reject(e);
		})
	})
	return promise
}


Date.prototype.addDays = function(days){
	// console.log(this.valueOf)
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

function parseCookie (cookie){
	if ( typeof cookie !== "string" ) {
		return ""
	}
	var cookieObjs = cookie.split(";");

	var cookieObj = {};

	for (var i = 0; i < cookieObjs.length; i++) {
		var searchObjStr = cookieObjs[i];
		var key = searchObjStr.split("=")[0];
		key = key.replace(/\s+/g,'');
		var value = searchObjStr.split("=")[1];
		cookieObj[key] = value;
	};
	return cookieObj
}