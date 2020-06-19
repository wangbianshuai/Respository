const requestServiceLog = require("../../entities/requestServiceLog");
const { assignProporties, getTextBox, getButton } = require("../../Common");

//MessageManage/requestServiceLogEdit 500-599
const dataActionTypes = {
    //get entity data
    getEntityData: 500,
}

const entity = {
    name: requestServiceLog.name, primaryKey: requestServiceLog.primaryKey, expandMethods: {
        getEntityData: "getEntityData"
    }
}

module.exports = {
    name: "requestServiceLogEdit",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "requestServiceLogEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "RequestServiceLogEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(requestServiceLog, getProperties())
    }
}

function getButtonProperties() {
    return [{
        name: "LeftSpace1",
        type: "WhiteSpace",
        className: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...getButton("BackToLast", "返回", ""), eventActionName: "BackToLast", style: { marginLeft: 10 } }]
}

function getProperties() {
    return [
        getTextBox2("LogTypeName", "日志类型", 1, 1),
        getTextBox2("ServiceInterfaceName", "服务接口", 2, 1),
        getTextBox2("ReSendCount", "重发次数", 3, 1),
        getTextBox2("isReSendName", "是否重发", 4, 1),
        getTextBox2("StartTime", "开始时间", 5, 1),
        getTextBox2("EndTime", "结束时间", 6, 1),
        getTextBox2("ElapsedMilliseconds", "耗时(毫秒)", 7, 1),
        getTextArea("RequestContent", "请求报文", 8, 1),
        getTextArea("ResponseContent", "响应报文", 9, 1),
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
        isReadOnly: true,
        isEdit: true
    }
}

function getButtonView() {
    return {
        name: "ButtonView",
        type: "View",
        className: "divCenterButton",
        isDiv: true,
        isFormItem: true,
        colSpan: 24,
        x: 10,
        y: 1,
        properties: assignProporties({ name: "requestServiceLogEdit" }, getButtonProperties())
    }
}

function getTextArea(name, label, x, y, placeHolder) {
    return {
        ...getTextBox(name, label, "TextArea", x, y),
        isFormItem: true,
        isNullable: true,
        isEdit: true,
        colSpan: 24,
        Rows: 6,
        isReadOnly: true,
        placeHolder,
        labelCol: 8,
        wrapperCol: 8
    }
}

function getEventActions() {
    return [{
        name: "BackToLast",
        type: "Page/ToPage",
        pageUrl: "/systemManage/RequestServiceLogList",
        expandsetPageUrl: "expandsetPageUrl"
    },
    {
        name: "getEntityData",
        type: "EntityEdit/getEntityData",
        editView: "RequestServiceLogEdit2"
    }]
}