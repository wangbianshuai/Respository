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
        const { LoginName, LoginPassword } = data.EntityData;

        const payload = { Action: this.GetAction(id, actionType) };

        payload.username = LoginName;
        payload.password = LoginPassword;

        this.DvaActions.Dispatch("EmployeeService", "Login", payload);
    }

    SetLogin(id, actionType, data) {
        if (!this.Receives[id]) return false;

        data = this.SetApiResponse(data);

        if (data.IsSuccess === false || !data.access_token) {
            Common.RemoveCookie("Token");

            return { IsSuccess: false, Message: "登录名或密码错误！" }
        }

        Common.SetCookie("Token", data.access_token);

        const payload = { Action: this.GetAction(id, this.ActionTypes.GetData) };
        payload.Action.Token = data.access_token;
        payload.Token = data.access_token;

        this.DvaActions.Dispatch("UserService", "GetData", payload);
        return false
    }

    SetGetData(id, actionType, data) {
        if (!this.Receives[id]) return false;

        const token = data.Action.Token;
        data = this.SetApiResponse(data);
        if (data.IsSuccess === false || !data.userId) {
            Common.RemoveCookie("Token");

            this.DispatchToReceive(id, this.ActionTypes.Login, { IsSuccess: false, Message: "登录用户未授权！" });
            return false;
        }

        const payload = { Token: token, Action: this.GetAction(id, this.ActionTypes.GetEmployeeData) };
        payload.Action.UserId = data.userId;

        this.DvaActions.Dispatch("EmployeeService", "GetData", payload);
        return false
    }

    SetGetEmployeeData(id, actionType, data) {
        if (!this.Receives[id]) return false;

        const userId = data.Action.UserId;
        data = this.SetApiResponse(data);
        if (data.IsSuccess === false) {
            Common.RemoveCookie("Token");

            data = { IsSuccess: false, Message: "登录异常！" }
        }
        else data.userId = userId;

        this.DispatchToReceive(id, this.ActionTypes.Login, data);

        return false
    }
}