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

const entity = { name: 'MarriageUser', primaryKey: 'UserId' };

module.exports = {
    name: "marriageUserEdit",
    type: "View",
    entity,
    eventActions: getEventActions(),
    properties: [marriageUserEditView()]
}


function marriageUserEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        isRootDiv: true,
        className: 'divRegister',
        properties: [marriageUserEditView2()]
    }
}

function marriageUserEditView2() {
    return {
        name: "marriageUserEditEdit",
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
            label: "缘份从这里开始"
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
        getTextBox2('NowAddress', '现居住地', '', 1, 1, '现居住地', 100, true),
        { ...getDatePicker2('Birthday', '公历生日', '请选择公历生日', false), className: 'divPickerDate', minYear: 1949 },
        getSelectPicker('BirthTime', '出生时辰', getShiChenDataSource(), 6, 1, false),
        { ...getTextBox2('LunarBirthday', '农历生日', '', 1, 1, '', 100, true), isReadOnly: true, style: { color: '#108ee9' } },
        { ...getTextBox2('BirthEight', '生辰八字', '', 1, 1, '', 100, true), isReadOnly: true, style: { color: '#108ee9' } },
        getTextBox2('Remark', '个性签名', 'textarea', 1, 1, '个性签名', 500, true),
        {
            name: 'IsPublic',
            label: '信息是否公开（公开广场中可见）',
            type: 'Switch',
            isEdit: true,
            defaultValue: 0
        },
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

function getDatePicker2(name, label, placeHorder, isNullable) {
    return { ...getDatePicker(name, label), placeHorder, isEdit: true, isNullable, isRed: !isNullable }
}

function getTextBox2(name, label, controlType, x, y, placeHorder, maxLength, isNullable) {
    return { ...getTextBox(name, label, controlType, x, y, placeHorder, maxLength), isEdit: true, clear: true, isNullable, isRed: !isNullable }
}

function getSelectPicker(name, label, dataSource, x, y, isNullable) {
    return { ...getSelect(name, label, dataSource, x, y), isEdit: true, isNullable, isRed: !isNullable }
}


function getEventActions() {
    return [{
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "marriageUserEditEdit",
        expandSetEntityData: 'expandSetEntityData',
        successCallback: 'saveEntityDataCallback'
    }]
}

function getItem(value, text) { return { value, text } }

function getShiChenDataSource() {
    return [
        getItem(0, '子 00:00-00:59'),
        getItem(1, '丑 01:00-01:59'),
        getItem(2, '丑 02:00-02:59'),
        getItem(3, '寅 03:00-03:59'),
        getItem(4, '寅 04:00-04:59'),
        getItem(5, '卯 05:00-05:59'),
        getItem(6, '卯 06:00-06:59'),
        getItem(7, '辰 07:00-07:59'),
        getItem(8, '辰 08:00-08:59'),
        getItem(9, '巳 09:00-09:59'),
        getItem(10, '巳 10:00-10:59'),
        getItem(11, '午 11:00-11:59'),
        getItem(12, '午 12:00-12:59'),
        getItem(13, '未 13:00-13:59'),
        getItem(14, '未 14:00-14:59'),
        getItem(15, '申 15:00-15:59'),
        getItem(16, '申 16:00-16:59'),
        getItem(17, '酉 17:00-17:59'),
        getItem(18, '酉 18:00-18:59'),
        getItem(19, '戌 19:00-19:59'),
        getItem(20, '戌 20:00-20:59'),
        getItem(21, '亥 21:00-21:59'),
        getItem(22, '亥 22:00-22:59'),
        getItem(23, '子 23:00-23:59'),
    ]
}