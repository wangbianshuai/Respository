var http = require('http');

var index = require("./src/Index");

http.createServer(function (request, response) {
    new index(request, response).Load();
}).listen(8016);