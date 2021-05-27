const accountCategory = require("../../entities/accountCategory");
const { assignProporties, getTextBox, getButton, getSelect2 } = require("../../Common");

//accountManage/accountCategoryEdit 1100-1199
const dataActionTypes = {
    //get entity data
    getEntityData: 1100,
    //Save entity data
    saveEntityData: 1101
}

const { name, primaryKey } = accountCategory;
const entity = { name, primaryKey };


module.exports = {
    name: "accountCategoryEdit",
    type: "View",
    noRightNames: ['saveEntityData'],
    eventActions: getEventActions(),
    properties: assignProporties({ name: "accountCategoryEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "accountCategoryEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(accountCategory, getProperties())
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
        getEditSelect("AccountItemId", "账目名称", accountCategory.accountItemsDataSource, 2, 1, false, "请选择账目名称"),
        getTextArea("Remark", "备注", 5, 1),
        getButtonView()
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
        x: 6,
        y: 1,
        properties: assignProporties({ name: "accountCategoryEdit" }, getButtonProperties())
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
        pageUrl: '/accountManage/accountCategoryList?selectedRowKey=#{' + entity.primaryKey + '}'
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "accountCategoryEdit2",
        expandSetEntityData: "expandSetEntityData"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "accountCategoryEdit2"
    }]
}