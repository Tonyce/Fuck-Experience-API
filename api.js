
'use strict';

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');

const authRouter = require('./authRouter');
const aboutRouter = require('./routers/about');
const scheduleRouter = require('./routers/schedule');


const indexRouter = new Router({
	prefix: '/api/index'
})

indexRouter.get("/", (ctx, next) => {
	ctx.body = {"content":"<h1>index card</h1>", "other":"index"}
})

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