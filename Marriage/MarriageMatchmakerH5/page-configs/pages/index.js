const { getTextBox, getSelect, getButton, getDatePicker } = require('../common');

//index 100-199
const dataActionTypes = {
    //get entity data
    getEntityData: 100,
    //Save entity data
    saveEntityData: 101,
    //deleteEntityData
    deleteEntityData: 102
};

const entity = { name: 'Matchmaker', primaryKey: 'MatchmakerId' };

module.exports = {
    name: "matchmakerEdit",
    type: "View",
    entity,
    eventActions: getEventActions(),
    properties: [matchmakerEditView()]
}


function matchmakerEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        isRootDiv: true,
        className: 'divRegister',
        properties: [matchmakerEditView2()]
    }
}

function matchmakerEditView2() {
    return {
        name: "matchmakerEditEdit",
        type: "View",
        entity,
        isList: true,
        className: 'divDetail',
        properties: getProperties()
    }
}

function getProperties() {
    return [
        {
            name: "title",
            type: 'SpanText',
            isDiv: true,
            x: 1,
            y: 1,
            className: 'divTitle',
            label: "注册成为红娘，红包等着你"
        },
        {
            name: 'HeadImgUrl',
            label: '头像',
            type: 'UploadImage',
            pathName: 'CollaborationImages',
            className: 'divUpdateImage',
            isListItem: true,
            isEdit: true,
            isNullable: false,
            width: 100,
            height: 100,
            maxSize: 100,
            nullTipMessage: "请选择图片",
            x: 2,
            y: 1
        },
        getTextBox2('NickName', '昵称', '', 1, 1, '请输入昵称', 20, false),
        getTextBox2('Name', '姓名', '', 1, 1, '请输入姓名', 20, false),
        { ...getTextBox2('IdCard', '身份证号', '', 1, 1, '请输入身份证号', 20, false), validateNames: ['validateIdentityCard'] },
        { ...getTextBox2('Phone', '手机号码', '', 1, 1, '请输入手机号码', 20, false), validateNames: ['validateMobile'] },
        getTextBox2('Province', '省份', '', 1, 1, '省份', 20, true),
        getTextBox2('City', '城市', '', 1, 1, '城市', 20, true),
        getTextBox2('Address', '家庭地址', '', 1, 1, '请输入家庭地址', 100, false),
        getTextBox2('Remark', '特点', 'textarea', 1, 1, '特点说明', 500, true),
        getButtonView()
    ]
}

function getButtonView() {
    return {
        name: 'buttonView',
        type: 'RowsColsView',
        isDiv: true,
        entity,
        className: "divButtonView",
        properties: [
            { ...getButton('save', '注册', 'primary', 1, 1), saveEntityDataActionType: dataActionTypes.saveEntityData, className: 'button', eventActionName: 'saveEntityData', rowClassName: "divRow4" },
        ]
    }
}

function getTextBox2(name, label, controlType, x, y, placeHorder, maxLength, isNullable) {
    return { ...getTextBox(name, label, controlType, x, y, placeHorder, maxLength), isEdit: true, clear: true, isNullable, isRed: !isNullable }
}

function getEventActions() {
    return [{
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "matchmakerEditEdit",
        expandSetEntityData: 'expandSetEntityData',
        successCallback: 'saveEntityDataCallback'
    }]
}