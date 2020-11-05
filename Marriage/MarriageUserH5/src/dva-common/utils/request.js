import { fetch } from 'dva';
import { Common, HttpResponse, Md5 } from 'UtilsCommon';
import { EnvConfig } from 'Configs';

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

    if (serviceName === "ResourcesService") {
        data.headers.token = getAccessToken(clientId, '784253FE-2E15-459F-93F3-26A23E9DE4B2');
    }
    else {
        data.headers.token = Common.getStorage(EnvConfig.tokenKey);
        if (!data.headers.token) data.headers.token = "d56b699830e77ba53855679cb1d252da" + window.btoa('781F60E1-429F-41E5-A93D-B8DA6F836182');
        const appId = '781F60E1-429F-41E5-A93D-B8DA6F836182';
        data.headers.access_token = getAccessToken(appId, data.headers.token);
    }

    return data;
}
function getAccessToken(appId, token) {
    const time = new Date().getTime()
    const md5str = Md5(appId + time + token);
    return window.btoa(appId + '@' + time + "@" + md5str);
}

function getFullUrl(url) {
    return Common.addUrlRandom(url)
}

function setResult(res) {
    return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.isNullOrEmptyReturnDefault(res.statusText, "请求错误！")))
}