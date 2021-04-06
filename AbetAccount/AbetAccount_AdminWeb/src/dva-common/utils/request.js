import { fetch } from 'dva';
import { Common, AjaxRequest, HttpResponse, Md5 } from 'UtilsCommon';
import { EnvConfig } from 'Configs';

export function get(url, resKey, serviceName, headers, callback) {
    return fetchRequest(url, null, resKey, serviceName, headers, callback)
}

export function post(url, data, resKey, serviceName, headers, callback) {
    return fetchByMethod(url, data, resKey, serviceName, headers, "POST", callback)
}

export function put(url, data, resKey, serviceName, headers, callback) {
    return fetchByMethod(url, data, resKey, serviceName, headers, "PUT", callback);
}

export function delete2(url, data, resKey, serviceName, headers, callback) {
    return fetchByMethod(url, data, resKey, serviceName, headers, "DELETE", callback);
}

export function postFormData(url, data, resKey, serviceName, headers, callback) {
    return fetchRequest(url, {
        method: "POST",
        headers: {},
        body: data,
    }, resKey, serviceName, headers, callback)
}

export function fetchByMethod(url, data, resKey, serviceName, headers, method, callback) {
    return fetchRequest(url, {
        method: method || "POST",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify(data)
    }, resKey, serviceName, headers, callback)
}

async function fetchRequest(url, data, resKey, serviceName, headers, callback) {
    try {
        data = await setServiceHeader(data, serviceName);
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
        for (let key in headers) data.headers[key] = headers[key];
    }

    return data;
}

async function setServiceHeader(data, serviceName) {
    if (!serviceName) return data;

    if (serviceName === 'WebService') return data;

    data = data || {};
    data.headers = data.headers || {};

    const time = await getCurrentTime();

    data.headers.token = Common.getStorage("token");
    if (!data.headers.token || data.headers.isNoToken) data.headers.token = "d56b699830e77ba53855679cb1d252da" + window.btoa(Common.createGuid());

    data.headers.access_token = getAccessToken(data.headers.token, time);

    return setApiServiceHeader(data, serviceName);
}

var _ClientConfig = {
};

function setApiServiceHeader(data, serviceName) {
    data = data || { headers: {}, method: "GET" };

    let clientId = "abet-account-web";

    if (_ClientConfig[serviceName]) clientId = _ClientConfig[serviceName];

    data.headers.clientTime = new Date().getTime();
    data.headers.clientId = clientId;
    data.headers.requestId = Common.createGuid().replace(/-/g, "").toLowerCase();

    return data;
}

function getCurrentTime() {
    const url = EnvConfig.getServiceUrl('ApiService')() + "default/getCurrentTime";

    if (window.timeDiff) return Promise.resolve(new Date().getTime() + window.timeDiff);

    const startTime = new Date().getTime();
    return post(url, {}).then(res => {
        if (res.Time) {
            window.timeDiff = res.Time - startTime;
            return Promise.resolve(res.Time);
        }
        else return Promise.resolve(new Date().getTime());
    })
}

function getAccessToken(token, time) {
    const appId = 'D5ADDC90-5AB2-4B3D-8C38-5025E4068CFA';
    const md5str = Md5(appId + time + token);
    return window.btoa(appId + '@' + time + "@" + md5str);
}

function getFullUrl(url) {
    return Common.addUrlRandom(url)
}

function setResult(res) {
    return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.isNullOrEmptyReturnDefault(res.statusText, "请求错误！")))
}