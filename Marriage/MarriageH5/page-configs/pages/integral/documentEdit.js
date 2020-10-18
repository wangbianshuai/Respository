const { getTextBox, getButton, getDatePicker } = require('../../common');

//integral/documentEdit 3000-3099
const dataActionTypes = {
    //get entity data
    getEntityData: 3000,
    //Save entity data
    saveEntityData: 3001,
    //deleteEntityData
    deleteEntityData: 3002
};

const entity = {
    name: 'Document', primaryKey: 'ClientDocumentsUID', deleteAct: 'ClientDocuments_Delete',
    dataPrimaryKey: 'UID', updateAct: 'ClientDocuments_Update', createAct: 'ClientDocuments_Create'
};

module.exports = {
    name: "documentEdit",
    type: "View",
    entity,
    eventActions: getEventActions(),
    properties: [getTabs(), documentEditView()]
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

function documentEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        className: 'divDetail',
        properties: [documentEditView2()]
    }
}

function documentEditView2() {
    return {
        name: "documentEditEdit",
        type: "View",
        entity,
        isList: true,
        className: 'divLogin',
        isClear: true,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'ClientDocuments_GetSingleInfo',
        },
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: getProperties()
    }
}

function getProperties() {
    return [
        { ...getSpanText2('Status', '状态'), dataSource: getStatusDataSource(), isListItem: true, isVisible: false },
        { ...getSpanText2('Points', '分数'), isListItem: true, isVisible: false },
        getTextBox2('Title', '标题', '', 1, 1, '请输入标题', 50, false),
        getTextBox2('DOI', 'DOI', '', 1, 1, '请输入DOI', 50, false),
        { ...getDatePicker2('PublishedDate', '发布日期', '请选择发布日期', false), className: 'divPickerDate' },
        getTextBox2('JournalName', '杂志', '', 1, 1, '（可选填）', 50, true),
        { name: 'Keywords', type: 'Keywords', className: 'divKeywords', label: '关键词', isEdit: true },
        { name: 'FilesUID', type: 'FileList', className: 'divFileList', label: '文件列表', isEdit: true, isNullable: false },
        { ...getCheckBoxGroup('ApplicationUIDs', '应用领域', getApplicationServiceDataSource(), 12, 1), listName: 'List' },
        { ...getCheckBoxGroup('TechniqueUIDs', '感兴趣的光谱技术', getTechniqueServiceDataSource(), 13, 1), listName: 'List' },
        getTextBox2('Description', '描述', 'textarea', 1, 1, '（可选填）', 500, true),
        getButtonView()
    ]
}

function getDatePicker2(name, label, placeHorder, isNullable) {
    return { ...getDatePicker(name, label), placeHorder, isEdit: true, isNullable, isRed: !isNullable }
}

function getCheckBoxGroup(name, label, serviceDataSource, x, y) {
    return { name, label, serviceDataSource, x, y, isString: true, isEdit: true, isList: true, type: 'CheckBoxGroup' };
}

function getApplicationServiceDataSource() {
    return {
        stateName: "getApplications",
        serviceName: "LibraryService",
        actionName: "getApplications",
        valueName: 'UID',
        textName: 'CnName',
        payload: {
            formData: {
                Param: '{}',
                Act: 'Application_GetList'
            }
        }
    }
}

function getTechniqueServiceDataSource() {
    return {
        stateName: "getTechniques",
        serviceName: "LibraryService",
        actionName: "getTechniques",
        valueName: 'UID',
        textName: 'Name',
        payload: {
            formData: {
                Param: '{}',
                Act: 'Technique_GetList'
            }
        }
    }
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

function getTextBox2(name, label, controlType, x, y, placeHorder, maxLength, isNullable) {
    return { ...getTextBox(name, label, controlType, x, y, placeHorder, maxLength), isEdit: true, clear: true, isNullable, isRed: !isNullable }
}

function getEventActions() {
    return [{
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "documentEditEdit"
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "documentEditEdit",
        successCallback: 'saveEntityDataCallback'
    },
    {
        name: "deleteEntityData",
        type: "entityEdit/deleteEntityData",
        dataActionType: dataActionTypes.deleteEntityData,
        backUrl: '/integral/get?tabPage=0',
        successTip: "删除成功!",
        confirmTip: "确认要删除吗?"
    }]
}