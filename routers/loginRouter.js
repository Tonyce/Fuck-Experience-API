
'use strict';

const Router = require('koa-router');
const GitHubAuth = require('./GitHubAuth');

const JWT = require('../JWT');

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

module.exports = login;

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
