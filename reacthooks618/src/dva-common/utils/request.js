import fetch from 'dva/fetch';
import { Common, AjaxRequest, HttpResponse } from 'UtilsCommon';

export function get(url, resKey, serviceName, headers, callback) {
    return fetchRequest(url, null, resKey, serviceName, headers, callback)
}

export function post(url, data, resKey, serviceName, headers, callback) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "POST", callback)
}

export function put(url, data, resKey, serviceName, headers, callback) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "PUT", callback);
}

export function delete2(url, data, resKey, serviceName, headers, callback) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "DELETE", callback);
}

export function postFormData(url, data, resKey, serviceName, headers, callback) {
    return fetchRequest(url, {
        method: "POST",
        headers: {},
        body: data,
    }, resKey, serviceName, headers, callback)
}

export function FetchByMethod(url, data, resKey, serviceName, headers, method, callback) {
    return fetchRequest(url, {
        method: method || "POST",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify(data)
    }, resKey, serviceName, headers, callback)
}

function fetchRequest(url, data, resKey, serviceName, headers, callback) {
    try {
        data = setServiceHeader(data, serviceName);
        data = setParamsHeader(data, headers);
        url = getFullUrl(url);
        if (callback) return syncAjax(url, data, resKey, callback);
        return fetch(url, data).then(res => setResult(res)).then(d => HttpResponse.getResponse(d, resKey), res => HttpResponse.getErrorResponse(res));
    }
    catch (error) {
        console.warn("dva-common/utils/request/fetchRequest", error);
        const res = { isSuccess: false, message: error.message || error }
        return HttpResponse.getErrorResponse(res, url, data)
    }
}
function syncAjax(url, data, resKey, callback) {
    return new Promise((resolve, reject) => {
        try {
            AjaxRequest.fetchRequest(url, data, (res) => {
                res = HttpResponse.getResponseData(res, resKey, url, data)
                callback && callback(res);
                resolve(res);
            }, false);
        }
        catch (error) {
            console.warn("dva-common/utils/request/syncAjax", error);
            const res = { isSuccess: false, message: error.message || error }
            callback && callback(res);
            resolve(res)
        }
    });
}

function setParamsHeader(data, headers) {
    if (headers) {
        data = data || {};
        data.headers = data.headers || {};
        for (let key in headers) data.headers[key] = headers[key];
        return data;
    }

    return data;
}

function setServiceHeader(data, serviceName) {
    if (!serviceName) return data;

    return setApiServiceHeader(data, serviceName);
}

var _ClientConfig = {
};

function setApiServiceHeader(data, serviceName) {
    data = data || { headers: {}, method: "GET" };

    let clientId = "A2-Digital-Solution-Web";

    if (_ClientConfig[serviceName]) clientId = _ClientConfig[serviceName];

    data.headers.clientId = clientId;
    data.headers.clientTime = new Date().getTime();
    data.headers.requestId = Common.createGuid().replace(/-/g, "").toLowerCase();

    return data;
}

function getFullUrl(url) {
    return Common.addUrlRandom(url)
}

function setResult(res) {
    return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.isNullOrEmptyReturnDefault(res.statusText, "请求错误！")))
}