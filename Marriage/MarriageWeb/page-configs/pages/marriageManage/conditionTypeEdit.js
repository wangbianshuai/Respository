const conditionType = require("../../entities/conditionType");
const { assignProporties, getTextBox, getButton, getRowTextBox, getRowSelect, getRowSelect2 } = require("../../Common");

//marriageManage/conditionTypeEdit 500-599
const dataActionTypes = {
    //get entity data
    getEntityData: 500,
    //Save entity data
    saveEntityData: 501
}

const { name, primaryKey } = conditionType;
const entity = {
    name, primaryKey, expandMethods: {
        getEntityData: "GetEntityData", insert: "Insert2", update: "Update2"
    }
}

const conditionTypeItem = { name: "ConditionItem", primaryKey: 'ItemId' }

module.exports = {
    name: "conditionTypeEdit",
    type: "View",
    eventActions: getEventActions(),
    properties: assignProporties({ name: "conditionTypeEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "conditionTypeEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(conditionType, getProperties())
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
        properties: assignProporties({ name: "conditionTypeEdit" }, getButtonProperties())
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
        entity: conditionTypeItem,
        nullTipMessage: "选项集合不能为空",
        properties: assignProporties(conditionTypeItem, getComplexProperties())
    }
}

function getComplexProperties() {
    return [
        getRowTextBox("Title", "标题", 8, "请输入标题", 100, false, true),
        getRowSelect("Sex", "适用对象", 2, conditionType.sexDataSource, 0, true, true),
        getRowSelect("DataType", "数据类型", 2, conditionType.dataTypeDataSource, "string", false, true),
        { ...getRowSelect2("DataSourceId", "数据源", 4, conditionType.dataSourceDataSource, undefined, true, true), allowClear: true },
        { ...getRowTextBox("DisplayIndex", "显示顺序", 2, "", 3, true, true), dataType: 'int' },
        {
            name: "IsSingle",
            label: "是否单选",
            text: "单选",
            defaultValue: 0,
            span: 2,
            isEdit: true,
            style: { marginTop: 4 },
            type: "CheckBox"
        },
        {
            name: "IsInterval",
            label: "是否区间值",
            text: "区间值",
            defaultValue: 0,
            span: 2,
            isEdit: true,
            style: { marginTop: 4 },
            type: "CheckBox"
        },
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
        name: "backToList",
        type: "page/toPage",
        propertyNames: [entity.primaryKey],
        pageUrl: '/marriageManage/conditionTypeList?selectedRowKey=#{' + entity.primaryKey + '}'
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "conditionTypeEdit2"
    },
    {
        name: "remove",
        type: "complexDataGrid/remove",
        complexDataGridView: "Properties",
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "conditionTypeEdit2"
    }]
}