import { Common } from "UtilsCommon";
import fetch from 'dva/fetch';
import { LogUtil } from "../../configs/EnvConfig";

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
    return fetch(url, data).then(res => SetResult(res)).then(d => GetResponse(d, resKey, url, data), res => GetErrorResponse(res, url, data));
}

function GetFullUrl(url) {
    if (url.indexOf("http") !== 0) url = GetRootPath() + url
    return Common.AddUrlRandom(url)
}

function GetRootPath() {
    return Common.GetRootPath();
}

function SetResult(res) {
    return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.IsNullOrEmptyReturnDefault(res.statusText, "请求错误！")))
}

function GetResponse(d, resKey, url, data) {
    SetLog(true, url, data, d);

    let obj = null

    if (d && d.Ack) {
        if (d.Ack.IsSuccess) obj = resKey ? d[resKey] : d
        else obj = { IsSuccess: false, Message: d.Ack.Message }
    }
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

function SetLog(blSuccess, url, data, res) {
    if (LogUtil && blSuccess) LogUtil.Info("请求信息", { url, RequestContent: JSON.stringify(data), ResponseContent: JSON.stringify(res) });
    else if (LogUtil && !blSuccess) LogUtil.Error("请求异常", { url, RequestContent: JSON.stringify(data), ResponseContent: JSON.stringify(res) });
}

function GetErrorResponse(res, url, data) {
    SetLog(false, url, data, res);
    const msg = res && res.message ? res.message : res
    return Promise.resolve({ IsSuccess: false, Message: msg })
}