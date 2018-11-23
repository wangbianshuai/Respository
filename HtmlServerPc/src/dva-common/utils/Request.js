import { Common, EnvConfig } from "UtilsCommon";
import fetch from 'dva/fetch';

export function Get(url, resKey, serviceName, headers) {
    return FetchRequest(url, null, resKey, serviceName, headers)
}

export function Post(url, data, resKey, serviceName, headers) {
    return FetchRequest(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(data)
    }, resKey, serviceName, headers)
}

function FetchRequest(url, data, resKey, serviceName, headers) {
    data = SetServiceHeader(data, serviceName);
    data = SetParamsHeader(data, headers);
    url = GetFullUrl(url);
    return fetch(url, data).then(res => SetResult(res)).then(d => GetResponse(d, resKey, url, data, serviceName), res => GetErrorResponse(res, url, data, serviceName));
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

    if (serviceName === "BizApiService" || serviceName === "BizApiService2"
        || serviceName === "TradeCenterApiService" || serviceName === "UserCenterApiService") return SetApiServiceHeader(data);
    else if (serviceName === "InvestmentApiService") return SetInvestmentApiServiceHeader(data);


    return data;
}

function SetInvestmentApiServiceHeader(data) {
    data = data || { headers: {}, method: "GET" };

    data.headers.clientId = "XXD_FRONT_END";
    data.headers.clientTime = new Date().getTime();

    return data;
}

function SetApiServiceHeader(data) {
    data = data || { headers: {}, method: "GET" };

    data.headers.clientId = "XXD_FRONT_END";
    data.headers.clientTime = new Date().getTime();
    data.headers.s = "111";

    return data;
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

function GetResponse(d, resKey, url, data, serviceName) {
    SetLog(true, url, data, d);

    let obj = null

    if (d && d.code) {
        if (d.code === "200000") {
            if (d && resKey && d.data && d.data[resKey]) obj = d.data[resKey];
            else if (d.data) obj = d.data;
            else obj = d;
        }
        else obj = { IsSuccess: false, Message: d.code + ":" + d.message }
    }
    else if (d && d.Ack) {
        if (d.Ack.IsSuccess) obj = resKey ? d[resKey] : d
        else obj = { IsSuccess: false, Message: d.Ack.Message }
    }
    else if (d && d.Exception) obj = { IsSuccess: false, Message: d.Exception };
    else if (d && d.Message) obj = { IsSuccess: false, Message: d.Message };
    else if (resKey) {
        if (d && d[resKey]) obj = d[resKey];
        else obj = d
    }
    else if (d) obj = d
    else obj = { IsSuccess: false, Message: "请求异常！" }

    return Promise.resolve(obj);
}

function SetLog(blSuccess, url, data, res) {
    if (EnvConfig.LogUtil && blSuccess) EnvConfig.LogUtil.Info("请求信息", { url, RequestContent: JSON.stringify(data), ResponseContent: JSON.stringify(res) });
    else if (EnvConfig.LogUtil && !blSuccess) EnvConfig.LogUtil.Error("请求异常", { url, RequestContent: JSON.stringify(data), ResponseContent: JSON.stringify(res) });
}

function GetErrorResponse(res, url, data, serviceName) {
    SetLog(false, url, data, res);
    const msg = res && res.message ? res.message : res
    return Promise.resolve({ IsSuccess: false, Message: msg })
}