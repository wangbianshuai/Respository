const adminUser = require("../../entities/adminUser");
const { assignProporties, getTextBox, getButton } = require("../../Common");

//配置管理/用户编辑 4400-4499
const dataActionTypes = {
    //获取实体数据
    getEntityData: 4400,
    //保存实体数据
    saveEntityData: 4401
}

const entity = { name: adminUser.name, primaryKey: adminUser.primaryKey }

module.exports = {
    name: "AdminUserEdit",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "AdminUserEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "AdminUserEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(adminUser, getProperties())
    }
}

function getButtonProperties() {
    return [{
        name: "LeftSpace1",
        type: "WhiteSpace",
        className: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...getButton("saveEntityData", "保存", "primary"), eventActionName: "saveEntityData", style: { width: 84 } },
    { ...getButton("BackToLast", "返回", ""), eventActionName: "BackToLast", style: { marginLeft: 10 } }]
}

function getProperties() {
    return [
        getTextBox2("LoginName", "登录名", 1, 1, "", "请输入登录名", 50, false),
        getTextBox2("UserName", "用户名", 2, 1, "", "请输入用户名", 50, false),
        { ...getTextBox2("LoginPassword", "登录密码", 3, 1, "", "请输入登录密码", 50, true), isJudgeNullable: false, controlType: "password" },
        { ...getTextBox2("LoginAgainPassword", "确认确认", 4, 1, "", "请输入确认确认", 50, true), isJudgeNullable: false, controlType: "password" },
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
        properties: assignProporties({ name: "AdminUserEdit" }, getButtonProperties())
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
        name: "BackToLast",
        type: "Page/ToPage",
        pageUrl: "/systemManage/AdminUserList"
    },
    {
        name: "saveEntityData",
        type: "EntityEdit/saveEntityData",
        editView: "AdminUserEdit2",
        expandsetEntityData: "expandsetAdminUserData"
    },
    {
        name: "getEntityData",
        type: "EntityEdit/getEntityData",
        editView: "AdminUserEdit2"
    }]
}