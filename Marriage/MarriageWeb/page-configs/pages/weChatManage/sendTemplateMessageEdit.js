const sendTemplateMessage = require("../../entities/sendTemplateMessage");
const { assignProporties, getTextBox, getButton, getSelect2, getRowTextBox } = require("../../Common");

//weChatManage/sendTemplateMessageEdit 1800-1899
const dataActionTypes = {
    //get entity data
    getEntityData: 1800,
    //Save entity data
    saveEntityData: 1801,
    //Save entity data
    saveEntityDataToSend: 1802
}

const { name, primaryKey } = sendTemplateMessage;
const entity = {
    name, primaryKey, expandMethods: {
        getEntityData: "GetEntityData", insert: "Insert2", update: "Update2"
    }
};

module.exports = {
    name: "sendTemplateMessageEdit",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "sendTemplateMessageEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "sendTemplateMessageEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(sendTemplateMessage, getProperties())
    }
}

function getButtonProperties() {
    return [{
        name: "leftSpace1",
        type: "WhiteSpace",
        className: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...getButton("saveEntityData", "保存", "primary"), eventActionName: "saveEntityData", style: { width: 84 } },
    {
        ...getButton("saveEntityDataToSend", "发送", ""), confirmTip: '确认立即调用微信接口发送吗？', successTip: '发送成功！',
        saveEntityDataActionType: dataActionTypes.saveEntityDataToSend, eventActionName: "saveEntityDataToSend", style: { marginLeft: 10, width: 84 }
    },
    { ...getButton("backToLast", "返回", ""), eventActionName: "backToLast", style: { marginLeft: 10 } }]
}

function getProperties() {
    return [
        {
            ...getEditSelect("TemplateId", "微信消息模板", sendTemplateMessage.weChatTemplateDataSource, 1, 1, false, "请选择微信消息模板"),
            selectDataToProperties: ["Content"]
        },
        { ...getEditSelect("UserTagIds", "粉丝标签", sendTemplateMessage.userTagDataSource, 2, 1, false, "请选择粉丝标签"), isMultiple: true, isString: true },
        getTextBox2("Color", "字体颜色", 3, 1, "", "", 20, true),
        { ...getTextArea("Content", "模板内容", 4, 1), isEdit: false, isReadOnly: true },
        getTextArea("Remark", "备注", 5, 1),
        getComplexView(),
        getButtonView()
    ]
}

function getComplexView() {
    return {
        name: "Properties",
        type: "ComplexDataGrid",
        title: "模板属性集合",
        x: 6,
        y: 1,
        colSpan: 24,
        isEdit: true,
        isAdd: false,
        properties: assignProporties(sendTemplateMessage, getComplexProperties())
    }
}

function getComplexProperties() {
    return [
        { name: "PropertyName", header: "属性名", type: "SpanText", span: 8 },
        getRowTextBox("Value", "属性值", 12, "", 1000),
        getRowTextBox("Color", "字体颜色", 4, "", 20),
    ]
}

function getEditSelect(name, label, serviceDataSource, x, y, isNullable, placeHolder, defaultValue) {
    return {
        ...getSelect2(name, label, serviceDataSource, x, y, defaultValue),
        isFormItem: true,
        colSpan: 24,
        labelCol: 8,
        wrapperCol: 8,
        isNullable,
        isEdit: true,
        allowClear: true, isSearch: true,
        placeHolder
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
        x: 7,
        y: 1,
        properties: assignProporties({ name: "sendTemplateMessageEdit" }, getButtonProperties())
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
        pageUrl: "/weChatManage/sendTemplateMessageList",
        expandSetPageUrl: "expandSetPageUrl"
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "sendTemplateMessageEdit2",
    },
    {
        name: "saveEntityDataToSend",
        type: "entityEdit/saveEntityData",
        editView: "sendTemplateMessageEdit2"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "sendTemplateMessageEdit2"
    }]
}