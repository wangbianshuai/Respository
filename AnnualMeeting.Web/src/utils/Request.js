import * as Common from "Common"

export function Get(url) {
    return FetchRequest(url)
}

export function Post(url, data) {
    return FetchRequest(url, { method: "POST", body: JSON.stringify(data) })
}

function FetchRequest(url, data, options) {
    url = GetFullUrl(url);
    fetch(url, options).then(res => SetResult(res)).then(d => GetResponse(d), res => GetErrorResponse(res));
}

function GetFullUrl(url) {
    url = GetRootPath() + url
    return Common.AddUrlRandom(url)
}

function GetRootPath() {
    return "http://localhost:51970/"
}

function SetResult(res) {
    return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.IsNullOrEmpty(res.statusText) ? "请求错误！" : res.statusText))
}

function GetResponse(d) {
    var obj = {};
    if (d && d.Ack) {
        if (d.Ack.IsSuccess) {
            obj = { IsSuccess: true, Data: {} };
            for (var key in d) if (key !== "Ack") obj.Data[key] = d[key];
        }
        else {
            obj = { IsSuccess: false, Message: d.Ack.StatusMessage }
        }
    }
    else if (d !== null) {
        if (Common.IsArray(d)) obj = { IsSuccess: true, Data: { DataList: d } }
        else obj = { IsSuccess: true, Data: d };
    }
    else {
        obj = { IsSuccess: false, Message: "请求异常！" }
    }

    return Promise.resolve(obj);
}

function GetErrorResponse(res) {
    const msg = res && res.message ? res.message : res
    Promise.resolve({ IsSuccess: false, Message: msg })
}