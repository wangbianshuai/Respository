import * as Common from "./Common";
/*
INVALID_TOKEN("200408","token 已失效"),
EXPIRED_TOKEN("200301","token 已过期"),
EMPTY_TOKEN("200302","token 没有传"),
PARSE_TOKEN_ERROR("200303","token 解析异常"),
NOT_FOUND_TOKEN("200304","token 自动失效（缓存为空）"),
MISMATCHED_DATA_TOKEN("200305","token 不一致（重复登录）"),
1005:token无效,用户不存在
405:cookie无效返回
*/

export function GetResponseData(d, resKey) {
    const blSuccess = d && d.IsSuccess === false ? false : true;

    if (!blSuccess) return d;

    let obj = null

    if (d && d.code !== undefined) {
        if ((d.code === "200000" || d.code === 0 || d.code === 200000 || d.code === "0") && resKey === false) obj = d;
        else if (d.code === "200000" || d.code === 0 || d.code === 200000 || d.code === "0") {
            if (d && resKey && d.data && d.data[resKey]) obj = d.data[resKey];
            else if (d && resKey) obj = d[resKey];
            else if (d.data && (Common.IsObject(d.data) || Common.IsArray(d.data))) obj = d.data;
            else obj = d;
        }
        else if (d.code === "200408" || d.code === "200301" || d.code === "200302" || d.code === "200303" || d.code === "200304" || d.code === "200305") {
            obj = { IsSuccess: false, IsReLogin: true, Message: d.code + ":" + d.message, Code: d.code }
        }
        else if (d.code === 1005) {
            obj = { IsSuccess: false, IsReLogin: true, Message: d.code + ":" + d.message, Code: d.code }
        }
        else obj = { IsSuccess: false, Message: d.code + ":" + d.message, Code: d.code }
    }
    else if (d && d.respCode !== undefined) {
        if (d.respCode === 0 && resKey === false) obj = d;
        else if (d.respCode === 0) {
            if (d && resKey && d[resKey]) obj = d[resKey];
            else if (d && resKey && d.data && d.data[resKey]) obj = d.data[resKey];
            else if (d.data) obj = d.data;
            else obj = d;
        }
        else obj = { IsSuccess: false, Message: d.respCode + ":" + d.respMsg, Code: d.respCode }
    }
    else if (resKey) {
        if (d && d[resKey]) obj = d[resKey];
        else obj = d
    }
    else if (d) obj = d
    else obj = { IsSuccess: false, Message: "请求异常！" }

    return obj;
}

export function GetResponse(d, resKey) {
    return Promise.resolve(GetResponseData(d, resKey));
}

export function GetErrorResponse(res) {
    const msg = res && res.message ? res.message : res;
    const code = msg ? msg.substring(0, 3) : ""
    var IsReLogin = code === "401" || code === "405"
    return Promise.resolve({ IsSuccess: false, IsReLogin, Message: msg })
}