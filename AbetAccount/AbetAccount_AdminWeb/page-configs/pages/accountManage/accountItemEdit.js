const accountItem = require("../../entities/accountItem");
const { assignProporties, getTextBox, getButton } = require("../../Common");

//accountManage/accountItemEdit 900-999
const dataActionTypes = {
    //get entity data
    getEntityData: 900,
    //Save entity data
    saveEntityData: 901
}

const { name, primaryKey } = accountItem;
const entity = { name, primaryKey };


module.exports = {
    name: "accountItemEdit",
    type: "View",
    noRightNames: ['saveEntityData'],
    eventActions: getEventActions(),
    properties: assignProporties({ name: "accountItemEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "accountItemEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(accountItem, getProperties())
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
        getTextBox2("Name", "名称", 1, 1, "", "请输入名称", 50, false),
        { ...getTextBox2("DisplayIndex", "序号", 2, 1, "", "请输入序号", 5, false), dataType: 'int' },
        getTextArea("Remark", "备注", 4, 1),
        getButtonView()
    ]
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

function getButtonView() {
    return {
        name: "buttonView",
        type: "View",
        className: "divCenterButton",
        isDiv: true,
        isFormItem: true,
        colSpan: 24,
        x: 5,
        y: 1,
        properties: assignProporties({ name: "accountItemEdit" }, getButtonProperties())
    }
}

function getTextArea(name, label, x, y, placeHolder) {
    return {
        ...getTextBox(name, label, "TextArea", x, y),
        isFormItem: true,
        isNullable: true,
        isEdit: true,
        colSpan: 24,
        Rows: 3,
        placeHolder,
        labelCol: 8,
        wrapperCol: 8
    }
}

function getEventActions() {
    return [{
        name: "backToList",
        type: "page/toPage",
        propertyNames: [entity.primaryKey],
        pageUrl: '/accountManage/accountItemList?selectedRowKey=#{' + entity.primaryKey + '}'
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "accountItemEdit2",
        expandSetEntityData: "expandSetEntityData"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "accountItemEdit2"
    }]
}