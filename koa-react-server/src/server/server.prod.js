require('@babel/polyfill');

import views from "koa-views";
import koaStatic from "koa-static";
import IndexRouter from "./routes/index";
import path from "path";

const app = require("./app");

//配置静态访问
app.use(koaStatic(path.resolve(process.cwd(), './dist/client')));
//配置模板引擎
app.use(views(path.resolve(process.cwd(), './dist/views'), { map: { html: 'ejs' } }));
//配置路由
app.use(new IndexRouter(true).Init());

app.listen(8080);