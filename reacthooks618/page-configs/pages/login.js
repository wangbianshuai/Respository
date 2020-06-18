const { assignProporties, getTextBox, getButton } =require("../Common");

//登录 4000-4099
const dataActionTypes = {
    //获取实体数据
    Login: 4000
}

module.exports= {
    name: "LoginView",
    type: "View",
    eventActions: getEventActions(),
    saveEntityDataActionType: dataActionTypes.Login,
    properties: assignProporties({name:"LoginView"}, getProperties())
}

function getProperties() {
    return [
        {
            name: "LoginTitle", type: "SpanText", x: 1, y: 1, text: "账户登录", className: "LoginHeader"
        },
        getTextBox2("LoginName", "", 1, 1, "", "请输入登录名", 50, false, "user"),
        getTextBox2("LoginPassword", "", 2, 1, "Password", "请输入登录密码", 50, false, "lock"),
        getButton2("Login", "登录", "primary", 3, 1)
    ]
}

function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength, isNullable, icon) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        isFormItem: true,
        size: "large",
        isEdit: true,
        pressEnterEventActionName: "Login",
        pressEnterEventPropertyName: "Login",
        PrefixIcon: { type: icon },
        isNullable,
        NullTipMessage: placeHolder
    }
}

function getButton2(name, label, ButtonType, x, y) {
    return {
        ...getButton(name, label, ButtonType, x, y),
        isFormItem: true,
        size: "large",
        eventActionName: "Login",
        style: { width: "100%" }
    }
}

function getEventActions() {
    return [{
        name: "Login",
        type: "EntityEdit/saveEntityData",
        editView: "LoginView",
        successCallback: "LoginSuccess"
    }]
}