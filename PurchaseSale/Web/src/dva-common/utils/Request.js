import { Common, AjaxRequest, HttpResponse } from "UtilsCommon";
import fetch from 'dva/fetch';

export function Get(url, resKey, serviceName, headers, callback) {
    return FetchRequest(url, null, resKey, serviceName, headers, callback)
}

export function Post(url, data, resKey, serviceName, headers, callback) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "POST", callback)
}

export function Put(url, data, resKey, serviceName, headers, callback) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "PUT", callback);
}

export function Delete(url, data, resKey, serviceName, headers, callback) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "DELETE", callback);
}

export function PostFormData(url, data, resKey, serviceName, headers, callback) {
    return FetchRequest(url, {
        method: "POST",
        headers: {},
        body: data,
    }, resKey, serviceName, headers, callback)
}

export function FetchByMethod(url, data, resKey, serviceName, headers, method, callback) {
    return FetchRequest(url, {
        method: method || "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(data)
    }, resKey, serviceName, headers, callback)
}

function FetchRequest(url, data, resKey, serviceName, headers, callback) {
    try {
        data = SetServiceHeader(data, serviceName);
        data = SetParamsHeader(data, headers);
        url = GetFullUrl(url);
        if (callback) return SyncAjax(url, data, resKey, callback);
        data.credentials = "include";
        return fetch(url, data).then(res => SetResult(res)).then(d => HttpResponse.GetResponse(d, resKey), res => HttpResponse.GetErrorResponse(res));
    }
    catch (error) {
        const res = { IsSuccess: false, Message: error.message || error }
        return HttpResponse.GetErrorResponse(res, url, data)
    }
}
function SyncAjax(url, data, resKey, callback) {
    return new Promise((resolve, reject) => {
        try {
            AjaxRequest.FetchRequest(url, data, (res) => {
                res = HttpResponse.GetResponseData(res, resKey, url, data)
                callback && callback(res);
                resolve(res);
            }, false);
        }
        catch (error) {
            const res = { IsSuccess: false, Message: error.message || error }
            callback && callback(res);
            resolve(res)
        }
    });
}

function SetParamsHeader(data, headers) {
    if (headers) {
        data = data || {};
        data.headers = data.headers || {};
        for (let key in headers) data.headers[key] = headers[key];
        return data;
    }

    return data;
}

function SetServiceHeader(data, serviceName) {
    if (!serviceName) return data;

    return SetApiServiceHeader(data, serviceName);
}

var _ClientConfig = {
};

function SetApiServiceHeader(data, serviceName) {
    data = data || { headers: {}, method: "GET" };

    let clientId = "PurchaseSaleWeb";

    if (_ClientConfig[serviceName]) clientId = _ClientConfig[serviceName];

    data.headers.clientId = clientId;
    data.headers.clientTime = new Date().getTime();
    data.headers.requestId = Common.CreateGuid().replace(/-/g, "").toLowerCase();

    return data;
}

function GetFullUrl(url) {
    return Common.AddUrlRandom(url)
}

function SetResult(res) {
    return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.IsNullOrEmptyReturnDefault(res.statusText, "请求错误！")))
}