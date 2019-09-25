import * as Request from "../utils/Request";
import { Common } from "UtilsCommon";

export default class Index {
    constructor(services, getServiceUrl, serviceName) {
        if (!Common.IsArray(services)) return;

        services.forEach(s => this[s.ActionName] = this.InitActionService(s, getServiceUrl, serviceName));
    }

    InitActionService(s, getServiceUrl, serviceName) {
        return async (payload) => {
            try {
                let url = s.Url;
                payload = payload || {};

                if (url && payload.PathQuery) url += payload.PathQuery;

                if (s.IsUrlParams) url = payload.Url
                else if (Common.IsNullOrEmpty(url) && !Common.IsNullOrEmpty(payload.Url)) url = payload.Url;

                //IsToken:请求必须有Token，HasToken:请求有Token才加上。
                let headers = {};
                if (s.IsToken && !payload.Token) return Promise.resolve(undefined);
                if ((s.IsToken || s.HasToken) && payload.Token) headers = { token: payload.Token };

                if (payload.UserAgent) { headers = headers || {}; headers["User-Agent"] = payload.UserAgent; }

                let callback = null;
                if (payload.Callback) callback = payload.Callback;

                let data = {};
                if (payload.Url !== undefined || payload.Token !== undefined || payload.Callback !== undefined || payload.Action !== undefined) { for (let key in payload) if (key !== "Url" && key !== "PathQuery" && key !== "Token" && key !== "Callback" && key !== "Action") data[key] = payload[key]; }
                else data = payload;

                if (url.indexOf("http") !== 0 && getServiceUrl) url = getServiceUrl() + url;

                //多个请求合并成一个
                if (payload.RequestList) {
                    return Promise.all(payload.RequestList.map(m => {
                        var url2 = m.Url;
                        if (url2.indexOf("http") !== 0 && getServiceUrl) url2 = getServiceUrl() + url2;
                        return this.RequestData(m.Action || s, url2, m.Data, m.DataKey || s.DataKey, m.ServiceName || serviceName, m.Header || headers);
                    }));
                }
                else return this.RequestData(s, url, data, s.DataKey, serviceName, headers, callback);
            }
            catch (error) {
                const res = { IsSuccess: false, Message: error.message || error };
                return Promise.resolve(res);
            }
        }
    }

    RequestData(s, url, data, dataKey, serviceName, headers, callback) {
        if (s.Method === "GET") return Request.Get(url, dataKey, serviceName, headers, callback);
        else if (s.Method === "PUT") return Request.Put(url, data, dataKey, serviceName, headers, callback);
        else if (s.Method === "DELETE") return Request.Delete(url, data, dataKey, serviceName, headers, callback);
        else if (s.IsFormData) return Request.PostFormData(url, data.FormData, dataKey, serviceName, headers, callback);
        else return Request.Post(url, data, dataKey, serviceName, headers, callback);
    }
}
