export function getResponseData(d, resKey) {
    const blSuccess = d && d.isSuccess === false ? false : true;

    if (!blSuccess) return d;

    let obj = null
    if (d.Exception || d.message) {
        const msg = d.Exception || d.message;
        obj = { isSuccess: false, message: msg }
        if (d.isReLogin) obj.isReLogin = true;
    }
    else if (d.Ack) {
        if (d.Ack.isSuccess) obj = d;
        else obj = { isSuccess: false, message: d.Ack.message || '请求异常' };
    }
    else if (resKey) {
        if (d && d[resKey]) obj = d[resKey];
        else obj = d
    }
    else if (d) obj = d
    else obj = { isSuccess: false, message: "请求异常！" }

    return obj;
}

export function getResponse(d, resKey) {
    return Promise.resolve(getResponseData(d, resKey));
}

export function getErrorResponse(res) {
    const msg = res && res.message ? res.message : res;
    return Promise.resolve({ isSuccess: false, message: msg })
}