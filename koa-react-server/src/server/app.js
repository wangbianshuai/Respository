import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import session from 'koa-session';
import compress from 'koa-compress';
import convert from 'koa-convert';
import LogUtil from "./utils/LogUtil";

const app = new Koa();

app.keys = ['xxd-server-pc-koa'];
app.use(convert(session(app)));
app.use(compress());
app.use(bodyParser());
app.use(json());
app.use(logger());

// logger
app.use(async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    var ms;
    try {
        //开始进入到下一个中间件
        await next();

        if (ctx.body === undefined) ctx.redirect("/404.html");

        ms = new Date() - start;
        //记录响应日志
        LogUtil.logResponse(ctx, ms);
    }
    catch (error) {
        ms = new Date() - start;
        //记录异常日志
        LogUtil.logError(ctx, error, ms);

        // 手动释放error事件
        ctx.app.emit('error', error, ctx);
    }
});

// response
app.on('error', function (err, ctx) {
    logger.error('server error', err, ctx);
});

export default app;