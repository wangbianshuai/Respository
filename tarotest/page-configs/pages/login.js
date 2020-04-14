// eslint-disable-next-line import/no-commonjs
const { assignProporties, getTextBox, getButton } =require('../Common');

//登录 4000-4099
const DataActionTypes = {
  //获取实体数据
  Login: 4000
}

// eslint-disable-next-line import/no-commonjs
module.exports = {
  name: "LoginView",
  type: "View",
  eventActions: getEventActions(),
  saveEntityDataActionType: DataActionTypes.Login,
  properties: assignProporties({ name: "LoginView" }, getProperties())
}

function getProperties() {
  return [
    {
      name: "LoginTitle", type: "SpanText", x: 1, y: 1, text: "Account Login", className: "login-header"
    },
    getTextBox2("LoginName", "", 1, 1, "", "please input login name", 50, false, "user"),
    { ...getTextBox2("LoginPassword", "", 2, 1, "password", "please input login password", 50, false, "lock"), className: 'password' },
    getButton2("Login", "Sign in", "primary", 3, 1)
  ]
}

function getTextBox2(name, label, x, y, contorlType, placeholder, maxLength, isNullable, icon) {
  return {
    ...getTextBox(name, label, contorlType, x, y, placeholder, maxLength || 50),
    isFormItem: true,
    isEdit: true,
    pressEnterEventActionName: "Login",
    pressEnterEventPropertyName: "Login",
    prefixIcon: { type: icon },
    isNullable,
    nullTipMessage: placeholder
  }
}

function getButton2(name, label, buttonType, x, y) {
  return {
    ...getButton(name, label, buttonType, x, y),
    size: "normal",
    eventActionName: "Login",
    style: { width: "100%" }
  }
}

function getEventActions() {
  return [{
    name: "Login",
    type: "EntityEdit/saveEntityData",
    editView: "LoginView",
    successCallback: "loginSuccess"
  },
  {
    name: "weChatLogin",
    type: "Page/weChatLogin",
    successCallback: "loginSuccess"
  }]
}
