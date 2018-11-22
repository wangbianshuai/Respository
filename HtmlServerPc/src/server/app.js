import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import session from 'koa-session';
import compress from 'koa-compress';
import convert from 'koa-convert';
import cors from "koa2-cors";
import LogUtil from "./utils/LogUtil";
import { EnvConfig } from "UtilsCommon";

const app = new Koa();

app.keys = ['xxd-server-pc-koa'];
app.use(convert(session(app)));
app.use(compress());
app.use(bodyParser());
app.use(json());
app.use(cors());
app.use(logger());

// logger
app.use(async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    var ms;
    try {
        //设置环境
        if (EnvConfig.Env === null) EnvConfig.SetEnv(ctx, LogUtil);

        //开始进入到下一个中间件
        await next();

        const url = ctx.originalUrl.toLowerCase();
        const isApi = url.indexOf("/api") === 0;

        //if (ctx.body === undefined && ctx.method === "GET" && !isApi && url.indexOf("404.html") < 0) ctx.redirect("/404.html");

        const isLog = ctx.IsLog === undefined ? true : ctx.IsLog;
        
        ms = new Date() - start;
        //记录响应日志
        isLog && LogUtil.logResponse(ctx, ms);
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