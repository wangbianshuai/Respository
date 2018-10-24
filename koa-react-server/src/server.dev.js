require('babel-polyfill');
require('source-map-support').install();
require('babel-register')({
    presets: ['env', 'react'],
    plugins: ['add-module-exports']
});

const koa = require("koa");
const router = require("./server/routes/index.dev");

const app = new koa();

//配置路由
app.use(router.routes());

app.listen(8080);