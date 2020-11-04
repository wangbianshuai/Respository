const { getTextBox, getSelect, getButton } = require('../common');

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
    properties: [getTabs(), marriageUserEditView()]
}

function getTabs() {
    return {
        name: 'tabs1',
        type: 'Tabs',
        isDiv: true,
        className: 'tabDetail',
        tabs: [{ title: '文献', url: "/marriageUser/get?tabPage=0" },
        { title: '科研经验', url: "/marriageUser/get?tabPage=1" },
        { title: '调查问卷', url: "/marriageUser/get?tabPage=2" },
        { title: '其它', url: "/marriageUser/get?tabPage=3" }]
    }
}

function marriageUserEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        className: 'divDetail',
        properties: [marriageUserEditView2()]
    }
}

function marriageUserEditView2() {
    return {
        name: "marriageUserEditEdit",
        type: "View",
        entity,
        isList: true,
        className: 'divLogin',
        properties: getProperties()
    }
}

function getProperties() {
    return [
        { ...getSpanText2('Status', '状态'), dataSource: getStatusDataSource(), isListItem: true, isVisible: false },
        getTextBox2('Title', '标题', '', 1, 1, '请输入标题', 50, false),
        getSelectPicker('Type', '分类', getTypeDataSource(), 6, 1, false),
        { ...getSpanText2('Points', '分数'), isListItem: true, isVisible: false },
        getTextBox2('Description', '描述', 'textarea', 1, 1, '请输入描述', 500, false),
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

function getSpanText2(name, label) {
    return { name, label, type: 'SpanText' }
}

function getStatusDataSource() {
    return [
        { value: 0, text: '审核中' },
        { value: 10, text: '审核不通过' },
        { value: 100, text: '审核通过' }
    ]
}

function getTypeDataSource() {
    return [
        { value: 1, text: 'Attend User meeting' },
        { value: 2, text: 'Give Talk on user meeting/FEST' },
        { value: 3, text: 'Support HORIBA seminar by place and arrangement' },
        { value: 4, text: 'Support HORIBA sample running and service' },
        { value: 5, text: 'Contribution to HORIBA magazine' },
        { value: 6, text: 'Technology transfer' },
        { value: 7, text: 'Others' }
    ]
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
        successCallback: 'saveEntityDataCallback'
    }]
}