import BaseIndex from "../BaseIndex";

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

        payload.LoginName = LoginName;
        payload.LoginPassword = LoginPassword;

        this.DvaActions.Dispatch("EmployeeService", "Login", payload);
    }
}