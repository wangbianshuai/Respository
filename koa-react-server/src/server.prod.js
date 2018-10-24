require('@babel/polyfill');

import koa from "koa";
import views from "koa-views";
import koaStatic from "koa-static";
import IndexRouter from "./server/routes/index.prod";
import path from "path";

const app = new koa();

//配置静态访问
app.use(koaStatic(path.resolve(__dirname, '../dist/client')));
//配置模板引擎
app.use(views(path.resolve(__dirname, '../dist/views'), { map: { html: 'ejs' } }));
//配置路由
app.use(new IndexRouter().Init().routes());

app.listen(8080);