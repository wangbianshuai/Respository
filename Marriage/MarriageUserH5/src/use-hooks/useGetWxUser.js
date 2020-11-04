import { useState, useEffect } from "react";
import { Common, PageCommon } from 'UtilsCommon';
import { useDispatch } from 'dva';
import { EnvConfig } from 'Configs';

const wxUserKey = '8A655A4E-4E87-4907-A328-280CF649032A';

const getStorageWxUser = () => {
    let str = Common.getStorage(wxUserKey);
    if (Common.isNullOrEmpty(str)) return null;

    const token = Common.getStorage(EnvConfig.tokenKey);
    if (Common.isNullOrEmpty(token)) {
        Common.setStorage(wxUserKey, '');
        return null;
    }

    str = window.btoa(str)
    return JSON.parse(str);
}

const setStorageWxUser = (wxUser) => {
    const str = window.atob(JSON.stringify(wxUser));
    Common.setStorage(wxUserKey, str);
};

const initWxStr = getStorageWxUser();
const isH5 = Common.isH5();

const getCode = () => {
    const wxAppID = 'wxaa64304b24432ce5';
    const wXUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    const scope = 'snsapi_userinfo';

    const redirect_uri = 'https://digital.a2china.cn/scrm/events/page/redirect.html?backurl=' + encodeURIComponent(window.location.href);

    window.location.href = `${wXUrl}?appid=${wxAppID}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${scope}&state=test#wechat_redirect`;
}

const getWxUser = (dispatchAction, code, setWxUser) => {
    dispatchAction("WxUserService", "getWxUser", { code }).then(res => {
        if (res.isSuccess === false) PageCommon.alert(res.message);
        else {
            setStorageWxUser(res);
            setWxUser(res);
        }
    });
}

export default (dispatchAction) => {
    const [wxUser, setWxUser] = useState(initWxStr);

    useEffect(() => {
        const queryString = Common.getQueryString();
        if (!wxUser) {
            if (queryString.code) getWxUser(dispatchAction, queryString.code, setWxUser);
            else if (isH5) getCode()
            else setWxUser({ isAuthQrCode: true })
        }
    }, [wxUser, dispatchAction, getCode, setWxUser]);

    return wxUser;
}
