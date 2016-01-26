
'use strict';

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
 
const authRouter = require('./routers/authRouter');
const loginRouter = require('./routers/loginRouter')
const indexRouter = require('./routers/indexRouter');
const topicRouter = require('./routers/topicRouter');
const scheduleRouter = require('./routers/schedule');

const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
const mongoUrl = 'mongodb://localhost:27017/FuckExperience';

//middle

app.use((ctx, next) => {
	let cookieObj = parseCookie(ctx.headers.cookie);
	ctx.cookieObj = cookieObj;
	// next()
	return next();
})

//login
app.use(loginRouter.routes())
   .use(loginRouter.allowedMethods());

//index
app.use(indexRouter.routes())
   .use(indexRouter.allowedMethods());


//topic
app.use(topicRouter.routes())
   .use(topicRouter.allowedMethods());

app.use(scheduleRouter.routes())
   .use(scheduleRouter.allowedMethods());

// auth
app.use(authRouter.routes())
   .use(authRouter.allowedMethods());


global._ObjectID = ObjectID;
global._db = "";
global._dataBase = "FuckExperience";

MongoClient.connect(mongoUrl, function(err, db) {
  	// console.log("connect mongodb...", err, db)
  	if(err){
		console.log("mongoClient open err", err)
		return
	}
	_db = db;
    // if (!module.parent) {
		app.listen(3000);
		console.log('listening on port 3000', new Date());
	// }
});


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

