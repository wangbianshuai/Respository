import { useState, useEffect, useMemo } from "react";
import { Common, PageCommon } from 'UtilsCommon';
import { useDispatch } from 'dva';
import { EnvConfig } from 'Configs';

const getStorageWxUser = () => {
    if (EnvConfig.env === 'local') {
        return {
            openId: 'ajNVdqHZLLCibciahBEkapef0FHr3QOdVfPLibiaKn',
            userId: 'f83b4fa9-13f0-464d-849f-f761d48fdadc',
            nickName: '测试',
            headImgUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJqlYPAOyuODiarTGRy4QwJfD1Dx7Tue3h8yIdochmsVDIjHOGlrb8xJZ0V7QjwicZ3TyJ022KjMLqQ/132'
        }
    }
    let str = Common.getStorage(EnvConfig.wxUserKey);
    if (Common.isNullOrEmpty(str)) return null;

    return JSON.parse(str);
};

const setStorageWxUser = (wxUser) => {
    Common.setStorage(EnvConfig.wxUserKey, JSON.stringify(wxUser), 120);
};

function dispatchAction(dispatch) {
    return (name, actionName, payload) => {
        return dispatch({ type: name + '/' + actionName, payload, isloading: true }).then(res => Promise.resolve(res), res => Promise.resolve(res));
    }
}

const getOpenIdSetting = (dispatch) => {
    var url = 'http://digital.a2china.cn/Handlers/WeixinHandler.ashx';
    const companyId = 4;

    var formData = new FormData();
    formData.append('param', JSON.stringify({ companyId }));
    formData.append('act', 'GetOpenIdSetting');
    formData.append('url', url);

    dispatchAction(dispatch)("WxUserService", "getOpenIdSetting", { formData }).then(res => {
        if (!res.result) {
            PageCommon.alert(res.msg);
            return;
        }

        res = res.data;
        var scope = 'snsapi_userinfo';
    
        const redirectUrl = encodeURIComponent(window.location.href);
        window.location.href = res.weixinUrl.replace("$$REDIRECT_URI$$", redirectUrl).replace("$$SCOPE$$", scope).replace("$$STATE$$", "test");
    });
};

const getWxUser = (dispatch, code, setWxUser) => {
    var url = 'http://digital.a2china.cn/Handlers/WeixinHandler.ashx';
    const companyId = 4;
    const infoType = 2;

    var formData = new FormData();
    formData.append('param', JSON.stringify({ code, infoType, companyId }));
    formData.append('act', 'GetOpenId');
    formData.append('url', url);

    dispatchAction(dispatch)("WxUserService", "getWxUser", { formData }).then(res => {
        if (!res.result) {
            PageCommon.alert(res.msg);
            return;
        }
        const { openid, nickname, headimgurl } = res.data;

        const wxUser = { userId: Common.createGuid(), openId: openid, nickName: nickname, headImgUrl: headimgurl };
        setStorageWxUser(wxUser);
        setWxUser(wxUser);
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
            else getOpenIdSetting(dispatch)
        }
    }, [wxUser, dispatch, setWxUser]);

    return [wxUser, setWxUser];
}
