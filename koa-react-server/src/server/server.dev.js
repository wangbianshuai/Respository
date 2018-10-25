require('babel-polyfill');
require('source-map-support').install();
require('babel-register')({
    presets: ['env', 'react'],
    plugins: ['add-module-exports', "transform-object-rest-spread"]
});

const app = require("./app");
const IndexRouter = require("./routes");

//配置路由
app.use(new IndexRouter(false).Init());

app.listen(8080);