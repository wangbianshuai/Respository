import { Common, Md5 } from "UtilsCommon";
import BaseIndex from "../baseIndex";
import { EnvConfig } from 'Configs';

export default class login extends BaseIndex {
  constructor(props) {
    super(props);

    this.name = "login";
    this.minActionType = 100;
    this.maxActionType = 199;

    this.init();
  }

  //login
  login(id, actionType, data) {
    data.entityData.LoginPassword = Md5(data.entityData.LoginPassword);
    this.dvaActions.dispatch("AdminUserService", "login", { action: this.getAction(id, actionType), AdminUser: data.entityData });
  }

  setlogin(id, actionType, data) {
    if (!this.receives[id]) return false;

    data = this.setApiResponse(data);

    if (data.isSuccess === false) {
      Common.removeStorage(EnvConfig.tokenkey);

      return { isSuccess: false, message: "登录名或密码错误！" }
    }

    return data;
  }
}
