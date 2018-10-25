import * as Common from "../../common/utils/Common";
import LogUtil from "./LogUtil";

import request from 'request';

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

function fetch(url, data) {
    return new Promise((resolve, reject) => {
        request(url, data, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                LogUtil.Info("请求信息", { url, ...data, body })
                resolve(body)
            }
            else {
                LogUtil.Error("请求异常", { url, ...data, error })
                reject(error);
            }
        });
    });
}

function FetchRequest(url, data, resKey) {
    url = GetFullUrl(url);
    return fetch(url, data).then(res => SetResult(res)).then(d => GetResponse(d, resKey), res => GetErrorResponse(res));
}

function GetFullUrl(url) {
    if (url.indexOf("http") !== 0) url = GetRootPath() + url
    return Common.AddUrlRandom(url)
}

function GetRootPath() {
    return Common.GetRootPath();
}

function SetResult(res) {
    return Promise.resolve(JSON.parse(res));
}

function GetResponse(d, resKey) {
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

function GetErrorResponse(res) {
    const msg = res && res.message ? res.message : res;
    return Promise.resolve({ IsSuccess: false, Message: msg })
}