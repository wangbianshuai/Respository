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
            if (Common.IsNullOrEmpty(url) && !Common.IsNullOrEmpty(payload.Url)) url = payload.Url

            if (s.Method === "GET") return Request.Get(url, s.DataKey)
            else return Request.Post(url, payload, s.DataKey)
        }
    }
}