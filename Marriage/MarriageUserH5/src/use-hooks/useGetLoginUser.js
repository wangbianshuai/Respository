import { useState, useEffect, useMemo } from "react";
import { Common, PageCommon } from 'UtilsCommon';
import { EnvConfig } from 'Configs';

export default (wxUser, dispatchAction) => {
  const initToken = useMemo(() => Common.getStorage(EnvConfig.tokenKey), []);
  const [token, setToken] = useState(initToken);

  useEffect(() => {
    if (!token && wxUser && wxUser.openid) {
      dispatchAction('MarriageUserService', 'getUserByOpenId', { openId: wxUser.openid }).then(res => {
        if (res.isSuccess === false) PageCommon.alert(res.message);
        else {
          setToken(res.Token);
        }
      });
    }
  }, [token, dispatchAction, setToken, wxUser]);

  return token;
}
