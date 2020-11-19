const { getTextBox } = require('../../common');

//marriage/marriageArrange 2100-2199
const dataActionTypes = {
    //get entity data
    getEntityData: 2100,
    //Save entity data
    saveEntityData: 2101,
};

const entity = { name: 'MarriageArrange', primaryKey: 'marriageArrangeId'};

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
        eventActionName: "getEntityData",
        getEntityDataActionType: dataActionTypes.getEntityData,
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
        getTextBox2('MarriageDate', '相亲时间', '', 1, 1, '', 20, true),
        getTextBox2('MarriageAddress', '相亲地点', '', 1, 1, '', 100, false),
        getTextBox2('MarriageContent', '相亲情况', 'textarea', 1, 1, '', 500, true)
    ]
}

function getTextBox2(name, label, controlType, x, y, placeHorder, maxLength, isNullable) {
    return { ...getTextBox(name, label, controlType, x, y, placeHorder, maxLength), isReadOnly: true, style: { color: '#108ee9' }, isEdit: true, clear: true, isNullable, isRed: !isNullable }
}

function getEventActions() {
    return [{
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "marriageArrangeEditEdit"
    }]
}