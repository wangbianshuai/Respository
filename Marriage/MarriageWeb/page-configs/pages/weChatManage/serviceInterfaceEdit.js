const serviceInterface = require("../../entities/serviceInterface");
const { assignProporties, getTextBox, getButton } = require("../../Common");

//weChatManage/serviceInterfaceEdit 1200-1299
const dataActionTypes = {
    //get entity data
    getEntityData: 1200,
    //Save entity data
    saveEntityData: 1201
}

const { name, primaryKey } = serviceInterface;
const entity = { name, primaryKey };


module.exports = {
    name: "serviceInterfaceEdit",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "serviceInterfaceEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "serviceInterfaceEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(serviceInterface, getProperties())
    }
}

function getButtonProperties() {
    return [{
        name: "leftSpace1",
        type: "WhiteSpace",
        className: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...getButton("saveEntityData", "保存", "primary"), eventActionName: "saveEntityData", style: { width: 84 } },
    { ...getButton("backToLast", "返回", ""), eventActionName: "backToLast", style: { marginLeft: 10 } }]
}

function getProperties() {
    return [
        getTextBox2("Name", "名称", 1, 1, "", "请输入名称", 50, false),
        getTextBox2("InterfaceName", "接口名", 2, 1, "", "请输入接口名", 50, false),
        getTextBox2("MethodName", "方法名", 3, 1, "", "请输入方法名", 50, false),
        getTextBox2("Url", "URL", 4, 1, "", "请输入URL", 200, false),
        getTextArea("Remark", "备注", 5, 1),
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
        x: 6,
        y: 1,
        properties: assignProporties({ name: "serviceInterfaceEdit" }, getButtonProperties())
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
        name: "backToLast",
        type: "page/toPage",
        pageUrl: "/weChatManage/serviceInterfaceList",
        expandSetPageUrl: "expandSetPageUrl"
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "serviceInterfaceEdit2",
        expandSetEntityData: "expandSetEntityData"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "serviceInterfaceEdit2"
    }]
}