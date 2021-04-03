import { Common } from 'UtilsCommon';

export function getResponseData(d, resKey) {
    const blSuccess = d && d.isSuccess === false ? false : true;

    if (!blSuccess) return d;

    let obj = null
    if (d.Exception || d.Message) {
        const msg = d.Exception || d.Message;
        obj = { isSuccess: false, message: msg }
        if (d.IsReLogin) obj.isReLogin = true;
    }
    else if (d.Ack) {
        if (d.Ack.IsSuccess) obj = d;
        else {
            obj = { isSuccess: false, message: d.Ack.Message || '请求异常' };
            if (d.Ack.Code === -100) {
                Common.removeStorage("token");
                obj.isReLogin = true;
            }
        }
    }
    else if (resKey) {
        if (d && d[resKey]) obj = d[resKey];
        else obj = d
    }
    else if (d) obj = d
    else obj = { isSuccess: false, message: "请求异常！" }

    const token = Common.getCookie("token");
    if (token) {
        Common.setStorage("token", token, 120);
        obj.token = token;
    }

    return obj;
}

export function getResponse(d, resKey) {
    return Promise.resolve(getResponseData(d, resKey));
}

export function getErrorResponse(res) {
    const msg = res && res.message ? res.message : res;
    return Promise.resolve({ isSuccess: false, message: msg })
}