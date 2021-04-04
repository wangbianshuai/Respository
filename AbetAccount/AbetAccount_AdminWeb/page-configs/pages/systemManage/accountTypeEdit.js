const accountType = require("../../entities/accountType");
const { assignProporties, getTextBox, getButton } = require("../../Common");

//systemManage/accountTypeEdit 900-999
const dataActionTypes = {
    //get entity data
    getEntityData: 900,
    //Save entity data
    saveEntityData: 901
}

const { name, primaryKey } = accountType;
const entity = { name, primaryKey };


module.exports = {
    name: "accountTypeEdit",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "accountTypeEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "accountTypeEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(accountType, getProperties())
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
        getCheckbox('IsHaveCustomer', '是否关联客户', '关联客户', 2, 1),
        getTextArea("Remark", "备注", 4, 1),
        getButtonView()
    ]
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
        properties: assignProporties({ name: "accountTypeEdit" }, getButtonProperties())
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
        pageUrl: '/systemManage/accountTypeList?selectedRowKey=#{' + entity.primaryKey + '}'
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "accountTypeEdit2",
        expandSetEntityData: "expandSetEntityData"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "accountTypeEdit2"
    }]
}