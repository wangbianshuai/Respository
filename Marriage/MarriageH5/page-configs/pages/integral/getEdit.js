const { getTextBox, getSelect, getButton } = require('../../common');

//integral/getEdit 2500-2599
const dataActionTypes = {
    //get entity data
    getEntityData: 2500,
    //Save entity data
    saveEntityData: 2501,
    //deleteEntityData
    deleteEntityData: 2502
};

const entity = { name: 'Integral', primaryKey: 'PointRequireUID', deleteAct: 'Points_DeleteRequire', dataPrimaryKey: 'UID', updateAct: 'Points_UpdateRequire', createAct: 'Points_CreateRequire' };

module.exports = {
    name: "getEdit",
    type: "View",
    entity,
    eventActions: getEventActions(),
    properties: [getTabs(), getEditView()]
}

function getTabs() {
    return {
        name: 'tabs1',
        type: 'Tabs',
        isDiv: true,
        className: 'tabDetail',
        tabs: [{ title: '文献', url: "/integral/get?tabPage=0" },
        { title: '科研经验', url: "/integral/get?tabPage=1" },
        { title: '调查问卷', url: "/integral/get?tabPage=2" },
        { title: '其它', url: "/integral/get?tabPage=3" }]
    }
}

function getEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        className: 'divDetail',
        properties: [getEditView2()]
    }
}

function getEditView2() {
    return {
        name: "getEditEdit",
        type: "View",
        entity,
        isList: true,
        className: 'divLogin',
        isClear: true,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'Points_GetSingleRequireInfo',
        },
        getEntityDataActionType: dataActionTypes.getEntityData,
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
            { ...getButton('save', '保存', 'primary', 1, 1), size: 'small', saveEntityDataActionType: dataActionTypes.saveEntityData, className: 'button', eventActionName: 'saveEntityData', rowClassName: "divRow4" },
            { ...getButton('deleteButton', '删除', 'ghost', 1, 2), isVisible: false, size: 'small', saveEntityDataActionType: dataActionTypes.deleteEntityData, className: 'button', eventActionName: 'deleteEntityData', rowClassName: "divRow4" },
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
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "getEditEdit"
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "getEditEdit",
        successCallback: 'saveEntityDataCallback'
    },
    {
        name: "deleteEntityData",
        type: "entityEdit/deleteEntityData",
        dataActionType: dataActionTypes.deleteEntityData,
        backUrl: '/integral/get?tabPage=3',
        successTip: "删除成功!",
        confirmTip: "确认要删除吗?"
    }]
}