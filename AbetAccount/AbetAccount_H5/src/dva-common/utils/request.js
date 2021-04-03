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
        formData.append(key, data[key]);
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

async function fetchRequest(url, data, resKey, serviceName, headers) {
    try {
        data = await setServiceHeader(data, serviceName);
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

async function setServiceHeader(data, serviceName) {
    if (!serviceName) return data;

    return await setApiServiceHeader(data, serviceName);
}

var _ClientConfig = {
};

async function setApiServiceHeader(data, serviceName) {
    data = data || { headers: {}, method: "GET" };
    data.headers = data.headers || {};

    if (serviceName === 'WebService') return data;

    let clientId = "kemin-miniSite";

    if (_ClientConfig[serviceName]) clientId = _ClientConfig[serviceName];

    data.headers.clientId = clientId;
    data.headers.clientTime = new Date().getTime();
    data.headers.requestId = Common.createGuid().replace(/-/g, "").toLowerCase();

    if (serviceName === "ImageService") {
        data.headers.token = await getAccessToken(clientId, '3CE64FB1-215E-4A4E-B20E-0F7F4BDEA26A');
    }
    else {
        data.headers.token = Common.getStorage(EnvConfig.tokenKey);
        if (!data.headers.token) data.headers.token = "d56b699830e77ba53855679cb1d252db" + window.btoa('AEBA13EA-2340-4D76-9BCA-9804B4B9EA62');
        const appId = 'a2-app2-miniSite';
        data.headers.access_token = await getAccessToken(appId, data.headers.token);
    }

    return data;
}
export function getCurrentTime() {
    const url = EnvConfig.getServiceUrl('ApiService')() + "default/getCurrentTime";

    return post(url, {}).then(res => {
        if (res.Time) return Promise.resolve(res.Time);
        else return Promise.resolve(new Date().getTime());
    })
}

async function getAccessToken(appId, token) {
    const time = await getCurrentTime();
    const md5str = Md5(appId + time + token);
    return window.btoa(appId + '@' + time + "@" + md5str);
}

function getFullUrl(url) {
    return Common.addUrlRandom(url)
}

function setResult(res) {
    return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.isNullOrEmptyReturnDefault(res.statusText, "请求错误！")))
}