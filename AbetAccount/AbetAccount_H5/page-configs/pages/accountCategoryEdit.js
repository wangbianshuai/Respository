const accountCategory = require("../entities/accountCategory");
const { getTextBox, getButton, getSelect2 } = require("../Common");

//accountCategoryEdit 700-799
const dataActionTypes = {
    //get entity data
    getEntityData: 700,
    //Save entity data
    saveEntityData: 701,
    //Delete entity data
    deleteEntityData: 702
}

const { name, primaryKey } = accountCategory;
const entity = { name, primaryKey };


module.exports = {
    name: "accountCategoryEdit",
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
        text: '新增类别',
        isBack: true,
        rightProperty: {
            name: 'delete',
            type: 'ImageButton',
            imageName: 'delete.png',
            className: 'divDeleteButton',
            eventActionName: 'deleteEntityData',
            isVisible: false,
            successTip: "删除成功！",
            confirmTip: "请确认是否删除当前类别？",
        }
    }
}

function getEditView() {
    return {
        name: "accountCategoryEdit2",
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
        { ...getButton("saveEntityData", "保存", "primary"), eventActionName: "saveEntityData" },
    ]
}

function getProperties() {
    return [
        getTextBox2("Name", "名称", 1, 1, "", "请输入名称", 50, false),
        getEditSelect("AccountItemId", "账目名称", accountCategory.accountItemsDataSource, 3, 1, false, "请选择账目名称"),
        getTextArea("Remark", "备注", 5, 1)
    ]
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
        editView: "accountCategoryEdit2"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "accountCategoryEdit2",
        setGetEntityDataLoad: "setGetEntityDataLoad"
    },
    {
        name: "deleteEntityData",
        type: "entityEdit/deleteEntityData",
        editView: "accountCategoryEdit2"
    }]
}