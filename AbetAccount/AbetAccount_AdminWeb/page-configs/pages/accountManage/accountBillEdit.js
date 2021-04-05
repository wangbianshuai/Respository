const accountBill = require("../../entities/accountBill");
const { assignProporties, getTextBox, getButton, getRadio, getDatePicker, getSelect2 } = require("../../Common");

//accountManage/accountBillEdit 1300-1399
const dataActionTypes = {
    //get entity data
    getEntityData: 1300,
    //Save entity data
    saveEntityData: 1301
}

const { name, primaryKey } = accountBill;
const entity = { name, primaryKey };


module.exports = {
    name: "accountBillEdit",
    type: "View",
    noRightNames: ['saveEntityData'],
    eventActions: getEventActions(),
    properties: assignProporties({ name: "accountBillEdit" }, [getEditView()])
}

function getEditView() {
    return {
        name: "accountBillEdit2",
        type: "RowsColsView",
        entity: entity,
        isForm: true,
        eventActionName: "getEntityData",
        isClear: true,
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: assignProporties(accountBill, getProperties())
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
        { ...getRadio2('IncomeOutlay', '收支', accountBill.incomeOutlayDataSource, 1, 1, 0, 160), childNames: ['AccountCategoryId'] },
        {
            ...getEditSelect("AccountCategoryId", "类别", accountBill.accountCategorysDataSource, 2, 1, false, "请选择类别"),
            parentName: 'IncomeOutlay', parentPropertyName: 'IncomeOutlay'
        },
        getEditSelect("AccountItemId", "实体项目", accountBill.accountItemsDataSource, 3, 1, false, "请选择实体项目"),
        { ...getDatePicker2('BillDate', '日期', 4, 1, false, '', '请选择日期'), isCurrentDay: true },
        { ...getTextBox2("Amount", "金额", 5, 1, "", "请输入金额", 20, false), dataType: 'float', scale: 2 },
        { ...getTextBox2("Tax", "税额", 6, 1, "", "", 20, true), dataType: 'float', scale: 2 },
        getEditSelect("BillUser", "经手人", accountBill.usersDataSource, 7, 1, false, "请选择经手人"),
        getTextArea("Remark", "摘要", 8, 1),
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

function getDatePicker2(name, label, x, y, isNullable, defaultValue, placeHolder) {
    return {
        ...getDatePicker(name, label, x, y, defaultValue),
        isFormItem: true,
        colSpan: 24,
        labelCol: 8,
        wrapperCol: 8,
        isNullable,
        isEdit: true,
        placeHolder
    }
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
        x: 9,
        y: 1,
        properties: assignProporties({ name: "accountBillEdit" }, getButtonProperties())
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
        pageUrl: '/accountManage/accountBillList?selectedRowKey=#{' + entity.primaryKey + '}'
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "accountBillEdit2",
        expandSetEntityData: "expandSetEntityData"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "accountBillEdit2"
    }]
}