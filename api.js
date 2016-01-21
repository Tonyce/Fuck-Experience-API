
'use strict';

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');

 
const authRouter = require('./routers/authRouter');
const loginRouter = require('./routers/loginRouter')
const indexRouter = require('./routers/indexRouter');
const topicRouter = require('./routers/topicRouter');
const scheduleRouter = require('./routers/schedule');



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

