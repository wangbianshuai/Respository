export function GetResponseData(d, resKey) {
    const blSuccess = d && d.IsSuccess === false ? false : true;

    if (!blSuccess) return d;

    let obj = null

    if (d.Exception || d.Message) {
        const msg = d.Exception || d.Message;
        obj = { IsSuccess: false, Message: msg }
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
    return Promise.resolve({ IsSuccess: false, Message: msg })
}