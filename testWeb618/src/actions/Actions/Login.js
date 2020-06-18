import BaseIndex from "../BaseIndex";
import { Common, Md5 } from "UtilsCommon";

export default class Login extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Login";
        this.MinActionType = 4000;
        this.MaxActionType = 4099;

        this.Init();
    }

    //登录
    Login(id, actionType, data) {
        data.EntityData.LoginPassword = Md5(data.EntityData.LoginPassword);
        this.DvaActions.Dispatch("ApiService", "Login", { Action: this.GetAction(id, actionType), AdminUser: data.EntityData });
    }

    SetLogin(id, actionType, data) {
        if (!this.Receives[id]) return false;

        data = this.SetApiResponse(data);

        if (data.IsSuccess === false || !data.AdminUser) {
            Common.RemoveCookie("Token");

            return { IsSuccess: false, Message: "登录名或密码错误！" }
        }

        Common.SetCookie("Token", data.AdminUser.Token);

        return data.AdminUser;
    }
}