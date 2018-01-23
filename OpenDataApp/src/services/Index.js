import * as Request from "../utils/Request"
import * as Common from "../utils/Common"

export default class Index {
    constructor(services) {
        if (!Common.IsArray(services)) return

        services.forEach(s => {
            if (s.Method === "GET") this[s.ActionName] = async (payload) => {
                if (Common.IsNullOrEmpty(s.Url) && !Common.IsNullOrEmpty(payload.Url)) s.Url = payload.Url
                Request.Get(s.Url, s.DataKey)
            }
            else this[s.ActionName] = async (payload) => Request.Post(s.Url, payload, s.DataKey)
        })
    }
}