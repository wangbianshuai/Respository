import BaseIndex from "../BaseIndex";
import { Common } from "UtilsCommon";

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
        this.DvaActions.Dispatch("ApiService", "Login", { Action: this.GetAction(id, actionType), User: data.EntityData });
    }

    SetLogin(id, actionType, data) {
        if (!this.Receives[id]) return false;

        data = this.SetApiResponse(data);

        if (data.IsSuccess === false || !data.User) {
            Common.RemoveCookie("Token");

            return { IsSuccess: false, Message: "登录名或密码错误！" }
        }

        Common.SetCookie("Token", data.User.Token);

        return data.User;
    }
}