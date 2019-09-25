const { AssignProporties, GetTextBox, GetButton } =require("../Common");

//登录 4000-4099
const DataActionTypes = {
    //获取实体数据
    Login: 4000
}

module.exports= {
    Name: "LoginView",
    Type: "View",
    EventActions: GetEventActions(),
    SaveEntityDataActionType: DataActionTypes.Login,
    Properties: AssignProporties({Name:"LoginView"}, GetProperties())
}

function GetProperties() {
    return [
        {
            Name: "LoginTitle", Type: "SpanText", X: 1, Y: 1, Text: "账户登录", ClassName: "LoginHeader"
        },
        GetTextBox2("LoginName", "", 1, 1, "", "请输入登录名", 50, false, "user"),
        GetTextBox2("LoginPassword", "", 2, 1, "Password", "请输入登录密码", 50, false, "lock"),
        GetButton2("Login", "登录", "primary", 3, 1)
    ]
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, icon) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        IsFormItem: true,
        Size: "large",
        IsEdit: true,
        PressEnterEventActionName: "Login",
        PressEnterEventPropertyName: "Login",
        PrefixIcon: { Type: icon },
        IsNullable,
        NullTipMessage: PlaceHolder
    }
}

function GetButton2(Name, Label, ButtonType, X, Y) {
    return {
        ...GetButton(Name, Label, ButtonType, X, Y),
        IsFormItem: true,
        Size: "large",
        EventActionName: "Login",
        Style: { width: "100%" }
    }
}

function GetEventActions() {
    return [{
        Name: "Login",
        Type: "EntityEdit/SaveEntityData",
        EditView: "LoginView",
        SuccessCallback: "LoginSuccess"
    }]
}