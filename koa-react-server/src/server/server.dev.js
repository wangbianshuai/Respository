require('babel-polyfill');
require('source-map-support').install();

require('babel-register')({
    presets: ['env', 'react'],
    plugins: ['add-module-exports', "transform-object-rest-spread"]
});

const path = require("path")

require('node-require-alias').setAlias({
    "UtilsCommon": path.resolve(__dirname, "../utils-common/Index.js"),
    "DavCommon": path.resolve(__dirname, "../dva-common/Index.js")
});

const app = require("./app");

const IndexRouter = require("./routes/index");
//配置路由
app.use(new IndexRouter(false).Init());

const apiRouter = require("./routes/api");

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.listen(8080);