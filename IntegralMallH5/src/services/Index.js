import * as Request from "../utils/Request"
import * as Common from "../utils/Common"

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

            if (s.Method === "PUT") url = Common.AddUrlParams(url, "$put", "true");
            if (s.Method === "GET") url = Common.AddUrlParams(url, "$get", "true");
            else if (s.Method === "DELETE") url = Common.AddUrlParams(url, "$delete", "true");
            else if (s.Method === "DELETE2") {
                url = Common.AddUrlParams(url, "$delete", "true");
                url = Common.AddUrlParams(url, "$data", "true");
            }

            let data = {};
            if (payload.Url !== undefined) { for (let key in payload) if (key !== "Url") data[key] = payload[key]; }
            else data = payload;

            if (s.ActionName === "GetConfig") return Request.Get(url, s.DataKey)
            else return Request.Post(url, data, s.DataKey)
        }
    }
}