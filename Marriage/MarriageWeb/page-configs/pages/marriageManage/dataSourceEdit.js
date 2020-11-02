const dataSource = require("../../entities/dataSource");
const { assignProporties, getTextBox, getButton, getRowTextBox } = require("../../Common");

//marriageManage/dataSourceEdit 200-299
const dataActionTypes = {
    //get entity data
    getEntityData: 200,
    //Save entity data
    saveEntityData: 201
}

const { name, primaryKey } = dataSource;
const entity = {
    name, primaryKey, expandMethods: {
        getEntityData: "GetEntityData", insert: "Insert2", update: "Update2"
    }
}

const dataSourceItem = { name: "DataSourceItem", primaryKey: 'ItemId' }

module.exports = {
    name: "dataSourceEdit",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "dataSourceEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "dataSourceEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(dataSource, getProperties())
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
        getTextBox2("Remark", "备注", 2, 1, "", "", 200, true),
        getComplexView(),
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
        properties: assignProporties({ name: "dataSourceEdit" }, getButtonProperties())
    }
}

function getComplexView() {
    return {
        name: "Properties",
        type: "ComplexDataGrid",
        title: "选项集合",
        x: 3,
        y: 1,
        colSpan: 24,
        isEdit: true,
        isNullable: false,
        nullTipMessage: "选项集合不能为空",
        properties: assignProporties(dataSourceItem, getComplexProperties())
    }
}

function getComplexProperties() {
    return [
       getRowTextBox("Value", "选项值", 10, "请输入选项值", 100, false, true),
        getRowTextBox("Name", "选项标签", 10, "请输入选项标签",100, false, true),
        {
            name: "Delete",
            label: "删除",
            span: 2,
            style: { lineHeight: "30px", marginLeft: 10 },
            isEdit: false,
            eventActionName: "remove",
            type: "AButton"
        }
    ]
}

function getEventActions() {
    return [{
        name: "backToLast",
        type: "page/toPage",
        pageUrl: "/marriageManage/dataSourceList"
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "dataSourceEdit2"
    },
    {
        name: "remove",
        type: "complexDataGrid/remove",
        complexDataGridView: "Properties",
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "dataSourceEdit2"
    }]
}