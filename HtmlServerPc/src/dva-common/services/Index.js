import * as Request from "../utils/Request";
import { Common, EnvConfig } from "UtilsCommon";

export default class Index {
    constructor(services, getServiceUrl, serviceName) {
        if (!Common.IsArray(services)) return;

        services.forEach(s => this[s.ActionName] = this.InitActionService(s, getServiceUrl, serviceName));
    }

    InitActionService(s, getServiceUrl, serviceName) {
        return async (payload) => {
            let url = s.Url;
            payload = payload || {};

            if (s.IsUrlParams) url = payload.Url
            else if (Common.IsNullOrEmpty(url) && !Common.IsNullOrEmpty(payload.Url)) url = payload.Url;

            //IsToken:请求必须有Token，HasToken:请求有Token才加上。
            let headers = {};
            if (s.IsToken && !payload.Token) return Promise.resolve(undefined);
            if ((s.IsToken || s.HasToken) && payload.Token) headers = { token: payload.Token };

            if (payload.UserAgent) { headers = headers || {}; headers["User-Agent"] = payload.UserAgent; }

            let data = {};
            if (payload.Url !== undefined || payload.Token !== undefined) { for (let key in payload) if (key !== "Url" && key !== "Token") data[key] = payload[key]; }
            else data = payload;

            if (url.indexOf("http") !== 0 && getServiceUrl) url = getServiceUrl() + url;
            if (s.IsProxy) url = EnvConfig.GetProxyServiceUrl(s.Method === "GET", url, serviceName);

            if (s.Method === "GET") return Request.Get(url, s.DataKey, serviceName, headers);
            else return Request.Post(url, data, s.DataKey, serviceName, headers);
        }
    }
}