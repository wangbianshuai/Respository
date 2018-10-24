const koa = require("koa");
const views = require("koa-views");
const koaStatic = require("koa-static");
const router = require("./server/routes/index.prod");
const path = require("path");

const app = new koa();

//配置静态访问
app.use(koaStatic(path.resolve(__dirname, '../dist/client')));
//配置模板引擎
app.use(views(path.resolve(__dirname, '../dist/views'), { map: { html: 'ejs' } }));
//配置路由
app.use(router.routes());

app.listen(8080);