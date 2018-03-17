import * as Common from "./Common"
import fetch from 'dva/fetch';

export function Get(url, resKey) {
    return FetchRequest(url, null, resKey)
}

export function Post(url, data, resKey) {
    return FetchRequest(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(data)
    }, resKey)
}

function FetchRequest(url, data, resKey) {
    url = GetFullUrl(url);
    return fetch(url, data).then(res => SetResult(res)).then(d => GetResponse(d, resKey), res => GetErrorResponse(res));
}

function GetFullUrl(url) {
    url=Common.AddUrlParams(url,"LoginUserId", Common.GetStorage("LoginUserId"))
    if (url.indexOf("http") !== 0) url = GetRootPath() + url
    return Common.AddUrlRandom(url)
}

function GetRootPath() {
    return Common.DataApiUrl
}

function SetResult(res) {
    return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.IsNullOrEmpty(res.statusText) ? "请求错误！" : res.statusText))
}

function GetResponse(d, resKey) {
    let obj = null

    if (d && d.Ack) {
        if (d.Ack.IsSuccess) obj = resKey ? d[resKey] : d
        else obj = { IsSuccess: false, Message: d.Ack.StatusMessage }
    }
    else if (resKey === "$EntityConfig") obj = d;
    else if (d && d.Exception) obj = { IsSuccess: false, Message: d.Exception };
    else if (d && d.Message) obj = { IsSuccess: false, Message: d.Message };
    else if (resKey !== undefined) {
        if (d && d[resKey]) obj = d[resKey];
        else obj = d
    }
    else if (d) obj = d
    else obj = { IsSuccess: false, Message: "请求异常！" }

    return Promise.resolve(obj);
}

function GetErrorResponse(res) {
    const msg = res && res.message ? res.message : res
    Promise.resolve({ IsSuccess: false, Message: msg })
}