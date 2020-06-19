const { assignProporties, getTextBox, getButton } = require("../../Common");

//修改密码 4100-4199
const dataActionTypes = {
    //获取实体数据
    changePassword: 4100
}

module.exports = {
    name: "ChangePasswordView",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "changePassword" }, [getEditView()])
}

function getButtonProperties() {
    return [{
        name: "LeftSpace1",
        type: "WhiteSpace",
        className: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...getButton("saveEntityData", "保存", "primary"), eventActionName: "saveEntityData", style: { width: 84 } }]
}

function getEditView() {
    return {
        name: "ChangePasswordView2",
        type: "RowsColsView",
        isForm: true,
        isClear: true,
        SuccessTip: "修改成功",
        saveEntityDataActionType: dataActionTypes.changePassword,
        properties: assignProporties({ name: "changePassword" }, getProperties())
    }
}

function getProperties() {
    return [
        { ...getTextBox2("OldPassword", "原密码", 1, 1, "", "请输入原密码", 50, false), controlType: "password" },
        { ...getTextBox2("NewPassword", "新密码", 2, 1, "", "请输入新密码", 50, false), controlType: "password" },
        { ...getTextBox2("AgainNewPassword", "确认密码", 3, 1, "", "请输入确认密码", 50, false), controlType: "password" },
        getButtonView()
    ]
}

function getButtonView() {
    return {
        name: "ButtonView",
        type: "View",
        className: "divCenterButton",
        isDiv: true,
        isFormItem: true,
        colSpan: 24,
        x: 6,
        y: 1,
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
        type: "EntityEdit/saveEntityData",
        editView: "ChangePasswordView2"
    }]
}