const accountItem = require("../entities/accountItem");
const { getTextBox, getButton } = require("../Common");

//accountItemEdit 900-999
const dataActionTypes = {
    //get entity data
    getEntityData: 900,
    //Save entity data
    saveEntityData: 901,
    //Delete entity data
    deleteEntityData: 902
}

const { name, primaryKey } = accountItem;
const entity = { name, primaryKey };


module.exports = {
    name: "accountItemEdit",
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
        text: '新增实体项目',
        isBack: true,
        rightProperty: {
            name: 'delete',
            type: 'ImageButton',
            imageName: 'delete.png',
            className: 'divDeleteButton',
            eventActionName: 'deleteEntityData',
            isVisible: false,
            successTip: "删除成功！",
            confirmTip: "请确认是否删除当前实体项目？",
        }
    }
}

function getEditView() {
    return {
        name: "accountItemEdit2",
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
        getTextArea("Remark", "备注", 5, 1)
    ]
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
        editView: "accountItemEdit2"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "accountItemEdit2",
        setGetEntityDataLoad: "setGetEntityDataLoad"
    },
    {
        name: "deleteEntityData",
        type: "entityEdit/deleteEntityData",
        editView: "accountItemEdit2"
    }]
}