const AppAccount = require("../../entities/AppAccount");
const { assignProporties, getTextBox, getButton } = require("../../Common");

//systemManage/AppAccountEdit 200-299
const dataActionTypes = {
    //get entity data
    getEntityData: 200,
    //Save entity data
    saveEntityData: 201
}

const entity = { name: AppAccount.name, primaryKey: AppAccount.primaryKey }

module.exports = {
    name: "AppAccountEdit",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "AppAccountEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "AppAccountEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(AppAccount, getProperties())
    }
}

function getButtonProperties() {
    return [{
        name: "LeftSpace1",
        type: "WhiteSpace",
        className: "ant-col ant-col-10 ant-form-item-label"
    },
    { ...getButton("saveEntityData", "保存", "primary"), eventActionName: "saveEntityData", style: { width: 84 } },
    { ...getButton("BackToLast", "返回", ""), eventActionName: "BackToLast", style: { marginLeft: 10 } }]
}

function getProperties() {
    return [
        getTextBox2("CompanyName", "公司名称", 1, 1, "", "请输入公司名称", 50, false),
        getTextBox2("AccessPathName", "访问路径名", 1, 2, "", "请输入访问路径名", 50, false),
        getTextBox2("LogoImageUrl", "公司Logo地址", 2, 1, "", "", 200, true),
        getTextBox2("Address", "地址", 2, 2, "", "", 200, true),
        getTextBox2("Linkman", "联系人", 3, 1, "", "", 50, true),
        getTextBox2("Phone", "手机", 3, 2, "", "", 50, true),
        getTextBox2("DeveloperWeChat", "开发者微信号", 4, 1, "", "请输入开发者微信号", 50, false),
        getTextBox2("AppId", "微信AppId", 4, 2, "", "请输入微信AppId", 50, false),
        { ...getTextArea("Secret", "微信Secret", 5, 1, "请输入微信Secret", 100), isNullable: false },
        getTextArea("Remark", "备注", 5, 2, "", 200),
        getButtonView()
    ]
}
function getTextBox2(name, label, x, y, contorlType, placeHolder, maxLength, isNullable, isVisible, validateNames, validateTipMessage) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50),
        validateNames, validateTipMessage,
        isFormItem: true,
        colSpan: 11,
        labelCol: 6,
        wrapperCol: 18,
        isNullable,
        isVisible,
        isEdit: true
    }
}

function getButtonView() {
    return {
        name: "ButtonView",
        type: "View",
        className: "DivCenterButton",
        isDiv: true,
        isFormItem: true,
        colSpan: 24,
        x: 11,
        y: 1,
        properties: assignProporties({ name: "AppAccountEdit" }, getButtonProperties())
    }
}

function getTextArea(name, label, x, y, placeHolder, maxLength) {
    return {
        ...getTextBox(name, label, "TextArea", x, y, placeHolder, maxLength),
        isFormItem: true,
        isNullable: true,
        isEdit: true,
        Rows: 3,
        colSpan: 11,
        labelCol: 6,
        wrapperCol: 18,
    }
}

function getEventActions() {
    return [{
        name: "BackToLast",
        type: "Page/ToPage",
        pageUrl: "/systemManage/AppAccountList",
        expandsetPageUrl: "expandsetPageUrl"
    },
    {
        name: "saveEntityData",
        type: "EntityEdit/saveEntityData",
        editView: "AppAccountEdit2",
        expandsetEntityData: "expandsetEntityData"
    },
    {
        name: "getEntityData",
        type: "EntityEdit/getEntityData",
        editView: "AppAccountEdit2"
    }]
}