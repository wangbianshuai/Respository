import * as Request from "../utils/Request";
import { Common } from "UtilsCommon";

export default (serviceName, getServiceUrl) => (action) => async (payload) => {
    try {
        let url = action.Url;
        payload = payload || {};

        if (url && payload.PathQuery) url += payload.PathQuery;

        if (action.IsUrlParams) url = payload.Url
        else if (Common.IsNullOrEmpty(url) && !Common.IsNullOrEmpty(payload.Url)) url = payload.Url;

        //IsToken:The request must have a Token, HasToken: the request has a Token plus。
        let headers = {};
        if (action.IsToken && !payload.Token) return Promise.resolve(undefined);
        if ((action.IsToken || action.HasToken) && payload.Token) headers = { token: payload.Token };

        if (payload.UserAgent) { headers = headers || {}; headers["User-Agent"] = payload.UserAgent; }

        let callback = null;
        if (payload.Callback) callback = payload.Callback;

        let data = {};
        if (payload.Url !== undefined || payload.Token !== undefined
            || payload.Callback !== undefined || payload.Action !== undefined) {
            for (let key in payload) {
                if (key !== "Url" && key !== "PathQuery" && key !== "Token" && key !== "Callback" && key !== "Action") {
                    data[key] = payload[key];
                }
            }
        }
        else data = payload;

        if (url.indexOf("http") !== 0 && getServiceUrl) url = getServiceUrl() + url;

        //Multiple requests merge into one
        if (payload.RequestList) {
            return Promise.all(payload.RequestList.map(m => {
                var url2 = m.Url;
                if (url2.indexOf("http") !== 0 && getServiceUrl) url2 = getServiceUrl() + url2;
                return RequestData(m.Action || action, url2, m.Data, m.DataKey || action.DataKey, m.ServiceName || serviceName, m.Header || headers);
            }));
        }
        else return RequestData(action, url, data, action.DataKey, serviceName, headers, callback);
    }
    catch (error) {
        const res = { IsSuccess: false, Message: error.message || error };
        return Promise.resolve(res);
    }
}

function RequestData(action, url, data, dataKey, serviceName, headers, callback) {
    if (action.Method === "GET") return Request.Get(url, dataKey, serviceName, headers, callback);
    else if (action.Method === "PUT") return Request.Put(url, data, dataKey, serviceName, headers, callback);
    else if (action.Method === "DELETE") return Request.Delete(url, data, dataKey, serviceName, headers, callback);
    else if (action.IsFormData) return Request.PostFormData(url, data.FormData, dataKey, serviceName, headers, callback);
    else return Request.Post(url, data, dataKey, serviceName, headers, callback);
}