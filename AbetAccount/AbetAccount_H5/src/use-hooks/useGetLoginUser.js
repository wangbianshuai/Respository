import { useState, useEffect, useMemo } from "react";
import { Common, PageCommon } from 'UtilsCommon';
import { EnvConfig } from 'Configs';

const setStorageWxUser = (wxUser) => {
    Common.setStorage(EnvConfig.wxUserKey, JSON.stringify(wxUser), 120);
};

export default (wxUser, pageAxis, dispatchAction) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (!userInfo) {
            if (pageAxis && !Common.isNullOrEmpty(pageAxis.token) && pageAxis.userInfo) {
                setUserInfo(pageAxis.userInfo);
            }
            else if (pageAxis && wxUser && wxUser.openId) {
                dispatchAction('UserService', 'getUserInfo', { ...wxUser, isMiniSite: true }).then(res => {
                    if (res.isSuccess === false) PageCommon.alert(res.message);
                    else {
                        pageAxis.userInfo = res;
                        if (wxUser.userId !== res.UserId) {
                            wxUser.userId = res.UserId;
                            setStorageWxUser(wxUser);
                        }
                        setUserInfo(pageAxis.userInfo);
                    }
                });
            }
        }
    }, [userInfo, dispatchAction, setUserInfo, wxUser, pageAxis]);

    return userInfo;
}
