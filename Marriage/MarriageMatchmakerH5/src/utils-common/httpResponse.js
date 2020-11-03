import errorCommonMessage from './errorCommonMessage';

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
        else obj = { isSuccess: false, message: d.Ack.Message || '请求异常' };
    }
    else if (d.Result === false) {
        const isReLogin = d.Code === 'User000103' || d.Code === 'User000101' || d.Code === 'User000102';
        if (d.Code) {
            const errorMessage = errorCommonMessage.filter(f => f.ID === d.Code);
            if (errorMessage.length > 0) d.Msg = errorMessage[0].Cn;
        }
        obj = { isSuccess: false, isReLogin, message: d.Msg };
    }
    else if (d.result === false) {
        obj = { isSuccess: false, message: d.msg };
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