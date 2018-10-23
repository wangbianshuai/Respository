require("babel-polyfill");
require('source-map-support').install();

require("babel-register")({
    presets: ["env", "react"],
    plugins: ['add-module-exports']
});

const app = require("./app.js");

app.listen(8080);