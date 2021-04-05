const adminUser = require("../../entities/adminUser");
const { assignProporties, getTextBox, getButton, getRadio } = require("../../Common");

//配置管理/用户编辑 4400-4499
const dataActionTypes = {
    //获取实体数据
    getEntityData: 4400,
    //保存实体数据
    saveEntityData: 4401
}

const { name, primaryKey } = adminUser;
const entity = { name, primaryKey };

module.exports = {
    name: "adminUserEdit",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "adminUserEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "adminUserEdit2",
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
        name: "leftSpace1",
        type: "WhiteSpace",
        className: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...getButton("saveEntityData", "保存", "primary"), eventActionName: "saveEntityData", style: { width: 84 } },
    { ...getButton("backToList", "返回", ""), eventActionName: "backToList", style: { marginLeft: 10 } }]
}

function getProperties() {
    return [
        getTextBox2("LoginName", "登录名", 1, 1, "", "请输入登录名", 50, false),
        getTextBox2("UserName", "用户名", 2, 1, "", "请输入用户名", 50, false),
        { ...getTextBox2("LoginPassword", "登录密码", 3, 1, "", "请输入登录密码", 50, true), isJudgeNullable: false, controlType: "password" },
        { ...getTextBox2("LoginAgainPassword", "密码确认", 4, 1, "", "请输入密码确认", 50, true), isJudgeNullable: false, controlType: "password" },
        getCheckbox('IsAdmin', '是否管理员', '管理员', 5, 1),
        getRadio2('DataRight', '数据权限', adminUser.dataRightDataSource, 6, 1, 0, 160),
        getRadio2('OperationRight', '操作权限', adminUser.operationRightDataSource, 7, 1, 0, 160),
        getButtonView()
    ]
}


function getRadio2(name, label, dataSource, x, y, defaultValue, buttonWidth) {
    return {
        ...getRadio(name, label, dataSource, x, y, defaultValue, buttonWidth),
        isFormItem: true,
        colSpan: 24,
        labelCol: 8,
        wrapperCol: 8,
        isEdit: true
    }
}


function getCheckbox(name, label, text, x, y) {
    return {
        name, label, text, x, y,
        isFormItem: true,
        type: 'CheckBox',
        colSpan: 24,
        labelCol: 8,
        wrapperCol: 8,
        isEdit: true
    }
}

function getButtonView() {
    return {
        name: "buttonView",
        type: "View",
        className: "divCenterButton",
        isDiv: true,
        isFormItem: true,
        colSpan: 24,
        x: 7,
        y: 1,
        properties: assignProporties({ name: "adminUserEdit" }, getButtonProperties())
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
        name: "backToList",
        type: "page/toPage",
        propertyNames: [entity.primaryKey],
        pageUrl: '/systemManage/adminUserList?selectedRowKey=#{' + entity.primaryKey + '}'
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "adminUserEdit2",
        expandSetEntityData: "expandSetAdminUserData"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "adminUserEdit2"
    }]
}