import { useState, useEffect, useMemo } from "react";
import { Common, PageCommon } from 'UtilsCommon';
import { EnvConfig } from 'Configs';

const getStorageLoginUser = () => {
  let str = Common.getStorage(EnvConfig.loginUserKey);
  if (Common.isNullOrEmpty(str)) return null;

  const token = Common.getStorage(EnvConfig.tokenKey);
  if (Common.isNullOrEmpty(token)) {
    Common.setStorage(EnvConfig.loginUserKey, '');
    return null;
  }

  str = window.atob(decodeURIComponent(str))
  return JSON.parse(str);
}

const setStorageLoginUser = (user) => {
  const str = window.btoa(encodeURIComponent(JSON.stringify(user)));
  Common.setStorage(EnvConfig.loginUserKey, str);
  Common.setStorage(EnvConfig.loginUserIdKey, user.UserId);
}

export default (wxUser, dispatchAction) => {
  const initLoginUser = useMemo(() => getStorageLoginUser(), []);
  const [loginUser, setLoginUser] = useState(initLoginUser);

  useEffect(() => {
    if (!loginUser && wxUser && wxUser.openid) {
      dispatchAction('MarriageUserService', 'getUserByOpenId', { openId: wxUser.openid }).then(res => {
        if (res && res.isSuccess === false) PageCommon.alert(res.message);
        else {
          if (res) setStorageLoginUser(res)
          setLoginUser(res);
        }
      });
    }
  }, [loginUser, dispatchAction, setLoginUser, wxUser]);

  return loginUser;
}
