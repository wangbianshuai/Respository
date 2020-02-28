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

    //login
    Login(id, actionType, data) {
        data.EntityData.LoginPassword = Md5(data.EntityData.LoginPassword);
        this.DvaActions.Dispatch("ApiService", "Login", { Action: this.GetAction(id, actionType), User: data.EntityData });
    }

    SetLogin(id, actionType, data) {
        if (!this.Receives[id]) return false;

        data = this.SetApiResponse(data);

        if (data.IsSuccess === false || !data.User) {
            Common.RemoveCookie("Token");

            return { IsSuccess: false, Message: "wrong username or password!" }
        }

        Common.SetCookie("Token", data.User.Token);

        return data.User;
    }
}