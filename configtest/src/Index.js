const fs = require("fs");
const url = require("url");

class Index {
    constructor(request, response) {
        this.Request = request;
        this.Response = response;
    }

    Load() {
        this.Response.setHeader('Content-Type', 'application/json; charset=utf-8');
        var content = "";

        try {
            const name = this.GetName();

            if (name) {
                content = this.GetConfig(name);

                this.SaveConfig(name, content);
            }
        }
        catch (err) { content = JSON.stringify({ Error: err.message }) }

        this.Response.write(content);
        this.Response.end();
    }

    GetName() {
        const pathname = url.parse(this.Request.url).pathname.substring(1);
        return pathname.split("/")[0]
    }

    GetConfig(name) {
        var user = require("./configs/" + name);
        return JSON.stringify(user);
    }

    SaveConfig(name, config) {
        const url = "src/dist/" + name + ".json";
        fs.writeFile(url, config, function () { });
    }

}

module.exports = Index;