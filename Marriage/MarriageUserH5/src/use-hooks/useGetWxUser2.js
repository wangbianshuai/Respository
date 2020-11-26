import { useState, useEffect, useMemo } from "react";
import { Common } from 'UtilsCommon';
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

export default () => {
    const initWxUser = useMemo(() => getStorageWxUser(), []);
    const [wxUser, setWxUser] = useState(initWxUser);

    useEffect(() => {
        if (!wxUser) setWxUser({ isAuthQrCode: true })
        else if (!wxUser.isAuthQrCode) setStorageWxUser(wxUser);
    }, [wxUser, setWxUser]);

    return [wxUser, setWxUser];
}