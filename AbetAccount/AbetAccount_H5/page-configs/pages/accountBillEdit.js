const accountBill = require("../entities/accountBill");
const { getTextBox, getButton, getRadio, getDatePicker, getSelect, getSelect2 } = require("../Common");

//accountBillEdit 400-499
const dataActionTypes = {
    //get entity data
    getEntityData: 400,
    //Save entity data
    saveEntityData: 401,
    //Delete entity data
    deleteEntityData: 402
}

const { name, primaryKey } = accountBill;
const entity = { name, primaryKey };


module.exports = {
    name: "accountBillEdit",
    type: "View",
    isDiv: true,
    className: 'divEditPage',
    noRightNames: ['saveEntityData'],
    eventActions: getEventActions(),
    properties: [getNavBar(), getEditView(), getButtonView()]
}

function getNavBar() {
    return {
        name: 'navTitle',
        type: 'NavBar',
        text: '新增记账',
        isBack: true,
        rightProperty: {
            name: 'delete',
            type: 'ImageButton',
            imageName: 'delete.png',
            className: 'divDeleteButton',
            eventActionName: 'deleteEntityData',
            isVisible: false,
            successTip: "删除成功！",
            confirmTip: "请确认是否删除当前记账记录？",
        }
    }
}

function getEditView() {
    return {
        name: "accountBillEdit2",
        type: "View",
        entity: entity,
        eventActionName: "getEntityData",
        isClear: true,
        isList: true,
        className: "divEditView",
        saveEntityDataActionType: dataActionTypes.saveEntityData,
        getEntityDataActionType: dataActionTypes.getEntityData,
        deleteEntityDataActionType: dataActionTypes.deleteEntityData,
        properties: getProperties()
    }
}

function getButtonProperties() {
    return [
        { ...getButton("saveEntityData", "保存", "primary"), isVisible: false, eventActionName: "saveEntityData" },
    ]
}

function getProperties() {
    return [
        { ...getRadio2('IncomeOutlay', '收支', accountBill.incomeOutlayDataSource, 1, 1, 0, 160), childNames: ['AccountCategoryId'] },
        {
            ...getEditSelect("AccountCategoryId", "类别", accountBill.accountCategorysDataSource, 2, 1, false, "请选择类别"),
            parentName: 'IncomeOutlay', parentPropertyName: 'IncomeOutlay'
        },
        getEditSelect("AccountItemId", "实体项目", accountBill.accountItemsDataSource, 3, 1, false, "请选择实体项目"),
        getEditSelect2("AccountType", "账户", accountBill.accountTypeDataSource, 4, 1, false, "账户", 0),
        { ...getDatePicker2('BillDate', '日期', 5, 1, false, '', '请选择日期'), isCurrentDay: true },
        { ...getTextBox2("Amount", "金额", 6, 1, "", "请输入金额", 20, false), dataType: 'float', scale: 2 },
        { ...getTextBox2("Tax", "税额", 7, 1, "", "", 20, true), dataType: 'float', scale: 2 },
        getEditSelect("BillUser", "经手人", accountBill.usersDataSource, 8, 1, false, "请选择经手人"),
        getTextArea("Remark", "摘要", 9, 1),

    ]
}

function getEditSelect2(name, label, serviceDataSource, x, y, isNullable, placeHolder, defaultValue) {
    return {
        ...getSelect(name, label, serviceDataSource, x, y, defaultValue),
        isNullable,
        isEdit: true,
        allowClear: true, isSearch: true,
        placeHolder
    }
}

function getRadio2(name, label, dataSource, x, y, defaultValue, buttonWidth) {
    return {
        ...getRadio(name, label, dataSource, x, y, defaultValue, buttonWidth),
        isEdit: true,
        isListItem: true
    }
}

function getDatePicker2(name, label, x, y, isNullable, defaultValue, placeHolder) {
    return {
        ...getDatePicker(name, label, x, y, defaultValue),
        isNullable,
        isEdit: true,
        placeHolder
    }
}

function getEditSelect(name, label, serviceDataSource, x, y, isNullable, placeHolder, defaultValue) {
    return {
        ...getSelect2(name, label, serviceDataSource, x, y, defaultValue),
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
        isNullable,
        isVisible,
        isEdit: true
    }
}

function getButtonView() {
    return {
        name: "buttonView",
        type: "View",
        className: "divEditPageButton",
        isDiv: true,
        properties: getButtonProperties()
    }
}

function getTextArea(name, label, x, y, placeHolder) {
    return {
        ...getTextBox(name, label, "textarea", x, y),
        isEdit: true,
        Rows: 3,
        placeHolder
    }
}

function getEventActions() {
    return [{
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "accountBillEdit2"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "accountBillEdit2",
        setGetEntityDataLoad: "setGetEntityDataLoad"
    },
    {
        name: "deleteEntityData",
        type: "entityEdit/deleteEntityData",
        editView: "accountBillEdit2"
    }]
}