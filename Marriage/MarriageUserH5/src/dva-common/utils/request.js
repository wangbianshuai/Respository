import { fetch } from 'dva';
import { Common, HttpResponse } from 'UtilsCommon';

export function get(url, resKey, serviceName, headers) {
    return fetchRequest(url, null, resKey, serviceName, headers)
}

export function post(url, data, resKey, serviceName, headers) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "POST")
}

export function put(url, data, resKey, serviceName, headers) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "PUT");
}

export function delete2(url, data, resKey, serviceName, headers) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "DELETE");
}

export function postFormData(url, data, resKey, serviceName, headers) {
    return fetchRequest(url, {
        method: "POST",
        body: getFormData(data),
    }, resKey, serviceName, headers)
}

function getFormData(data) {
    if (data instanceof FormData) return data;

    const formData = new FormData();
    for (var key in data) {
        formData.set(key, data[key]);
    }
    return formData;
}

export function postUrlFormData(url, data, resKey, serviceName, headers) {
    return fetchRequest(url, {
        method: "POST",
        headers: {},
        body: getUrlFormData(data)
    }, resKey, serviceName, headers)
}

function getUrlFormData(data) {
    const body = []
    for (var key in data) {
        body.push(key + "=" + encodeURIComponent(data[key]))
    }
    return body.join("&")
}

export function FetchByMethod(url, data, resKey, serviceName, headers, method) {
    return fetchRequest(url, {
        method: method || "POST",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify(data)
    }, resKey, serviceName, headers)
}

function fetchRequest(url, data, resKey, serviceName, headers) {
    try {
        data = setServiceHeader(data, serviceName);
        data = setParamsHeader(data, headers);
        
        url = getFullUrl(url);
        return fetch(url, data).then(res => setResult(res)).then(d => HttpResponse.getResponse(d, resKey), res => HttpResponse.getErrorResponse(res));
    }
    catch (error) {
        console.warn("dva-common/utils/request/fetchRequest", error);
        const res = { isSuccess: false, message: error.message || error }
        return HttpResponse.getErrorResponse(res, url, data)
    }
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
    data.headers = data.headers || {};

    let clientId = "marriage-user-h5";

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