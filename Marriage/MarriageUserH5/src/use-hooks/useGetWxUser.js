import { useState, useEffect, useMemo } from "react";
import { Common, PageCommon } from 'UtilsCommon';
import { useDispatch } from 'dva';
import { EnvConfig } from 'Configs';

const getStorageWxUser = () => {
    let str = Common.getStorage(EnvConfig.wxUserKey);
    if (Common.isNullOrEmpty(str)) return null;

    str = decodeURIComponent(window.atob(str))
    return JSON.parse(str);
}

const setStorageWxUser = (wxUser) => {
    const str = window.btoa(encodeURIComponent(JSON.stringify(wxUser)));
    Common.setStorage(EnvConfig.wxUserKey, str);
};

const isH5 = Common.isH5();

const getCode = () => {
    const wxAppID = 'wx2ed629d45a5214f7';
    const wXUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    const scope = 'snsapi_userinfo';

    const redirect_uri = 'https://digital.a2china.cn/scrm/events/page/redirect.html?backurl=' + encodeURIComponent(window.location.href);

    window.location.href = `${wXUrl}?appid=${wxAppID}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${scope}&state=test#wechat_redirect`;
}

function dispatchAction(dispatch) {
    return (name, actionName, payload) => {
        return dispatch({ type: name + '/' + actionName, payload, isloading: true }).then(res => Promise.resolve(res), res => Promise.resolve(res));
    }
}

const getWxUser = (dispatch, code, setWxUser) => {
    dispatchAction(dispatch)("WxUserService", "getWxUser", { code }).then(res => {
        if (res && res.isSuccess === false) PageCommon.alert(res.message);
        else {
            setStorageWxUser(res);
            setWxUser(res);
        }
    });
}

export default () => {
    const initWxUser = useMemo(() => getStorageWxUser(), []);
    const [wxUser, setWxUser] = useState(initWxUser);

    const dispatch = useDispatch();

    useEffect(() => {
        const queryString = Common.getQueryString();
        if (!wxUser) {
            if (queryString.code) getWxUser(dispatch, queryString.code, setWxUser);
            else if (isH5) getCode()
            else setWxUser({ isAuthQrCode: true })
        }
        else if (!wxUser.isAuthQrCode) setStorageWxUser(wxUser);
    }, [wxUser, dispatch, setWxUser]);

    return [wxUser, setWxUser];
}
