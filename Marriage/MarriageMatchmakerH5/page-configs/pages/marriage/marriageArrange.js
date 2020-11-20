const { getTextBox, getDatePicker, getButton } = require('../../common');

//marriage/marriageArrange 1600-1699
const dataActionTypes = {
    //get entity data
    getEntityData: 1600,
    //Save entity data
    saveEntityData: 1601,
    //获取用户红娘
    getMarriageArrangeById: 1602
};

const entity = { name: 'MarriageArrange', primaryKey: 'marriageArrangeId', dataPrimaryKey: 'MarriageArrangeId' };

module.exports = {
    name: "marriageArrangeEdit",
    type: "View",
    entity,
    eventActions: getEventActions(),
    properties: [marriageArrangeEditView()]
}

function marriageArrangeEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        className: 'divRegister',
        properties: [marriageArrangeEditView2()]
    }
}

function marriageArrangeEditView2() {
    return {
        name: "marriageArrangeEditEdit",
        type: "View",
        entity,
        isList: true,
        eventActionName: "getMarriageArrangeById",
        getEntityDataActionType: dataActionTypes.getMarriageArrangeById,
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
            label: "相亲安排基本信息"
        },
        getTextBox2('ManUserName', '男方', '', 1, 1, '', 20, false),
        getTextBox2('WomanUserName', '女方', '', 1, 1, '', 20, false),
        getTextBox2('AppMatchmakerName', '平台红娘', '', 1, 1, '', 20, true),
        { ...getDatePicker2('MarriageDate', '相亲时间', '请选择相亲时间', false), className: 'divPickerDate', isReadOnly: true, style: { color: '#108ee9' } },
        getTextBox2('MarriageAddress', '相亲地点', '', 1, 1, '', 100, true),
        getTextBox2('MarriageContent', '相亲情况', 'textarea', 1, 1, '', 500, true),
        { ...getTextBox2('Remark', '备注', 'textarea', 1, 1, '', 500, true), isReadOnly: false, isVisible: false },
        getButtonView()
    ]
}

function getButtonView() {
    return {
        name: 'buttonView',
        type: 'RowsColsView',
        isDiv: true,
        entity,
        isVisible: false,
        className: "divButtonView",
        properties: [
            { ...getButton('save', '保存', 'primary', 1, 1), saveEntityDataActionType: dataActionTypes.saveEntityData, className: 'button', eventActionName: 'saveEntityData', rowClassName: "divRow4" },
        ]
    }
}

function getDatePicker2(name, label, placeHorder, isNullable) {
    return { ...getDatePicker(name, label), placeHorder, isEdit: true, isReadOnly: true, style: { color: '#108ee9' }, isNullable, isRed: !isNullable }
}

function getTextBox2(name, label, controlType, x, y, placeHorder, maxLength, isNullable) {
    return { ...getTextBox(name, label, controlType, x, y, placeHorder, maxLength), isReadOnly: true, style: { color: '#108ee9' }, isEdit: true, clear: true, isNullable, isRed: !isNullable }
}

function getEventActions() {
    return [{
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "marriageArrangeEditEdit"
    },
    {
        name: "getMarriageArrangeById",
        type: "entityEdit/getEntityData",
        editView: "marriageArrangeEditEdit",
        setGetEntityDataLoad: 'setGetEntityDataLoad'
    }]
}