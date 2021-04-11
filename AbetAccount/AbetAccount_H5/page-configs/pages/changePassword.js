const { assignProporties, getTextBox, getButton } = require("../Common");

//修改密码 4100-4199
const dataActionTypes = {
    //获取实体数据
    changePassword: 4100
}

module.exports = {
    name: "changePasswordView",
    type: "View",
    isDiv: true,
    className: 'divEditPage',
    eventActions: getEventActions(),
    properties: assignProporties({ name: "changePassword" }, [getNavBar(), getEditView(),  getButtonView()])
}

function getNavBar() {
    return {
        name: 'navTitle',
        type: 'NavBar',
        text: '修改密码',
        isBack: true
    }
}

function getButtonProperties() {
    return [{...getButton("saveEntityData", "保存", "primary"), eventActionName: "saveEntityData", }]
}

function getEditView() {
    return {
        name: "changePasswordView2",
        type: "View",
        isList: true,
        isClear: true,
        className: "divEditView",
        successTip: "修改成功",
        saveEntityDataActionType: dataActionTypes.changePassword,
        properties: assignProporties({ name: "changePassword" }, getProperties())
    }
}

function getProperties() {
    return [
        { ...getTextBox2("OldPassword", "原密码", 1, 1, "", "请输入原密码", 50, false), controlType: "password" },
        { ...getTextBox2("NewPassword", "新密码", 2, 1, "", "请输入新密码", 50, false), controlType: "password" },
        { ...getTextBox2("AgainNewPassword", "确认密码", 3, 1, "", "请输入确认密码", 50, false), controlType: "password" },
      
    ]
}

function getButtonView() {
    return {
        name: "buttonView",
        type: "View",
        className: "divEditPageButton",
        isDiv: true,
        properties: assignProporties({ name: "changePassword" }, getButtonProperties())
    }
}

function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength, isNullable, isVisible, validateNames, validateTipMessage) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        validateNames, validateTipMessage,
        isFormItem: true,
        colSpan: 24,
        labelCol: 8,
        wrapperCol: 8,
        isNullable,
        isVisible,
        isEdit: true
    }
}

function getEventActions() {
    return [{
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "changePasswordView2"
    }]
}