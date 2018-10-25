import * as Request from "../../utils/Request"
import * as Common from "../../utils/Common";

var Request = {};
if (typeof (global) !== "undefined") Request = require("../../../server/utils/Request");
else Request = require("../../utils/Request");

export default class Index {
    constructor(services) {
        if (!Common.IsArray(services)) return

        services.forEach(s => this[s.ActionName] = this.InitActionService(s))
    }

    InitActionService(s) {
        return async (payload) => {
            let url = s.Url

            if (s.IsUrlParams) url = payload.Url
            else if (Common.IsNullOrEmpty(url) && !Common.IsNullOrEmpty(payload.Url)) url = payload.Url

            let data = {};
            if (payload.Url !== undefined) { for (let key in payload) if (key !== "Url") data[key] = payload[key]; }
            else data = payload;

            if (s.Method === "GET") return Request.Get(url, s.DataKey)
            else return Request.Post(url, data, s.DataKey)
        }
    }
}