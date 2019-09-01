import { Common } from "UtilsCommon";
import fetch from 'dva/fetch';
import AjaxRequest from "./AjaxRequest";
// import {Toast} from "antd-mobile";

export function Get(url, resKey, serviceName, headers, callback) {
    return FetchRequest(url, null, resKey, serviceName, headers, callback)
}

export function Post(url, data, resKey, serviceName, headers, callback) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "POST", callback)
}

export function Put(url, data, resKey, serviceName, headers, callback) {
    return FetchByMethod(url, data, resKey, serviceName, headers, "PUT", callback);
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
        return fetch(url, data).then(res => SetResult(res)).then(d => GetResponse(d, resKey, url, data), res => GetErrorResponse(res, url, data));
    }
    catch (error) {
        const res = { IsSuccess: false, Message: error.message || error }
        return GetErrorResponse(res, url, data)
    }
}

function SyncAjax(url, data, resKey, callback) {
    return new Promise((resolve, reject) => {
        try {
            AjaxRequest.FetchRequest(url, data, (res) => {
                res = GetResponseData(res, resKey, url, data)
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

export function PostUrlFormData(url, data, resKey, serviceName, headers) {
    return FetchRequest(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: GetFormData(data)
    }, resKey, serviceName, headers)
}

function GetFormData(data) {
    let body = []
    for (var key in data) {
        body.push(key + "=" + encodeURIComponent(data[key]))
    }
    return body.join("&")
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
    UserCenterApiService: "XXD_FRONT_END_H5",
    FileCenterApiService: "XXD_FRONT_END_H5",
    ApiH5Service: "XXD_FRONT_END_H5"
};

function SetApiServiceHeader(data, serviceName) {
    data = data || { headers: {}, method: "GET" };

    let clientId = "XXD_FRONT_END";

    if (_ClientConfig[serviceName]) clientId = _ClientConfig[serviceName];

    data.headers.clientId = clientId;
    data.headers.clientTime = new Date().getTime();
    data.headers.s = Common.CreateGuid().replace(/-/g, "").toLowerCase();

    return data;
}

function GetFullUrl(url) {
    return Common.AddUrlRandom(url)
}

function SetResult(res) {
    return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.IsNullOrEmptyReturnDefault(res.statusText, "请求错误！")))
}

/*
INVALID_TOKEN("200408","token 已失效"),
EXPIRED_TOKEN("200301","token 已过期"),
EMPTY_TOKEN("200302","token 没有传"),
PARSE_TOKEN_ERROR("200303","token 解析异常"),
NOT_FOUND_TOKEN("200304","token 自动失效（缓存为空）"),
MISMATCHED_DATA_TOKEN("200305","token 不一致（重复登录）"),
*/

function GetResponseData(d, resKey, url) {
    let obj = null

    if (d && d.code) {
        if (d.code === "200000" && resKey === false) obj = d;
        else if (d.code === "200000") {
            if (d && resKey && d.data && d.data[resKey]) obj = d.data[resKey];
            else if (d.data) obj = d.data;
            else obj = { IsSuccess: false, Message: "请求异常！", ResData: d }
        }
        else if (d.code === "200408" || d.code === "200301" || d.code === "200302" || d.code === "200303" || d.code === "200304" || d.code === "200305") {
			// Toast.fail(url, 3);
            obj = { IsSuccess: false, IsReLogin: true, Message: d.code + ":" + d.message, Code: d.code }
        }
        else if (d.code === "0") obj = { IsSuccess: false, Message: "请求异常！" }
        else obj = { IsSuccess: false, Message: d.code + ":" + d.message, Code: d.code }
    }
    else if (resKey) {
        if (d && d[resKey]) obj = d[resKey];
        else obj = d
    }
    else if (d) obj = d
    else obj = { IsSuccess: false, Message: "请求异常！" }

    return obj;
}

function GetResponse(d, resKey, url, data) {
    return Promise.resolve(GetResponseData(d, resKey, url, data));
}

function GetErrorResponse(res, url, data) {
    const msg = res && res.message ? res.message : res
    return Promise.resolve({ IsSuccess: false, Message: msg })
}