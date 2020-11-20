const { getTextBox, getButton, getDatePicker } = require('../../common');

//marriage/marriageFee 1700-1999
const dataActionTypes = {
    //get entity data
    getEntityData: 1700,
    //Save entity data
    saveEntityData: 1701,
};

const entity = { name: 'MarriageFee', primaryKey: 'marriageArrangeId', dataPrimaryKey: 'MarriageArrangeId' };

module.exports = {
    name: "marriageFeeEdit",
    type: "View",
    entity,
    eventActions: getEventActions(),
    properties: [marriageFeeEditView()]
}

function marriageFeeEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        className: 'divRegister',
        properties: [marriageFeeEditView2()]
    }
}

function marriageFeeEditView2() {
    return {
        name: "marriageFeeEditEdit",
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
            label: "相亲费用"
        },
        getTextBox3("ManMatchmakerName", "男方红娘", 1, 1, true),
        getTextBox4("ManAmount", "男方红娘金额", 1, 2, false, false, '请输入男方红娘金额', 'float', 10),
        getTextBox4("ManAppAmount", "男方平台金额", 2, 1, false, false, '请输入男方平台金额', 'float', 10),
        getTextBox4("ManRemark", "男方备注", 2, 2, false, true, '备注'),
        getTextBox3("WomanMatchmakerName", "女方红娘", 3, 1, true),
        getTextBox4("WomanAmount", "女方红娘金额", 3, 2, false, false, '请输入女方红娘金额', 'float', 10),
        getTextBox4("WomanAppAmount", "女方平台金额", 4, 1, false, false, '请输入女方平台金额', 'float', 10),
        getTextBox4("WomanRemark", "女方备注", 4, 2, false, true, '备注'),
        getTextBox3("AppMatchmakerName", "平台红娘", 5, 1, true),
        getTextBox4("AppAmount", "平台红娘金额", 5, 2, false, false, '请输入平台红娘金额', 'float', 10),
        getTextBox4("AppAppAmount", "平台方平台金额", 6, 1, false, false, '请输入平台方平台金额', 'float', 10),
        getTextBox4("AppRemark", "平台方备注", 6, 2, false, true, '备注'),
        getTextBox3("Amount", "总金额", 7, 1, true),
        getDatePicker2("FeeDate", "费用日期", '请选择费用日期', false),
        getButtonView()
    ]
}

function getDatePicker2(name, label, placeHorder, isNullable) {
    return { ...getDatePicker(name, label), placeHorder, labelNumber: 7, isEdit: true, isNullable, isRed: !isNullable }
}

function getTextBox3(name, label, x, y) {
    return { ...getTextBox(name, label, x, y), isReadOnly: true, isEdit: true, labelNumber: 7, style: { color: '#108ee9' } }
}

function getButtonView() {
    return {
        name: 'buttonView',
        type: 'RowsColsView',
        isDiv: true,
        entity,
        className: "divButtonView",
        properties: [
            { ...getButton('save', '保存', 'primary', 1, 1), saveEntityDataActionType: dataActionTypes.saveEntityData, className: 'button', eventActionName: 'saveEntityData', rowClassName: "divRow4" },
        ]
    }
}

function getTextBox4(name, label, x, y, isReadOnly, isNullable, placeHolder, dataType, maxLength, contorlType) {
    return {
        ...getTextBox(name, label, contorlType, x, y, placeHolder, maxLength || 50), labelNumber: 7,
        isEdit: true, clear: true, isNullable, isRed: !isNullable, isReadOnly, dataType
    }
}

function getEventActions() {
    return [{
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "marriageFeeEditEdit"
    },
    {
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "marriageFeeEditEdit"
    }]
}