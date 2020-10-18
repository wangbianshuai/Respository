const { getTextBox, getSelect, getButton } = require('../../common');

//integral/experienceEdit 2900-2999
const dataActionTypes = {
    //get entity data
    getEntityData: 2900,
    //Save entity data
    saveEntityData: 2901,
    //deleteEntityData
    deleteEntityData: 2902
};

const entity = {
    name: 'Experience', primaryKey: 'ResearchExUID', deleteAct: 'OpticalSchool_DeleteResearchEx',
    dataPrimaryKey: 'UID', updateAct: 'OpticalSchool_UpdateResearchEx', createAct: 'OpticalSchool_CreateResearchEx'
};

module.exports = {
    name: "experienceEdit",
    type: "View",
    entity,
    eventActions: getEventActions(),
    properties: [getTabs(), experienceEditView()]
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

function experienceEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        className: 'divDetail',
        properties: [experienceEditView2()]
    }
}

function experienceEditView2() {
    return {
        name: "experienceEditEdit",
        type: "View",
        entity,
        isList: true,
        className: 'divLogin',
        isClear: true,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'OpticalSchool_GetSingleResearchExInfo',
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
        getSelectPicker('ResearchExType', '分类', getTypeDataSource(), 6, 1, false),
        { ...getCheckBoxGroup('ApplicationUIDs', '应用领域', getApplicationServiceDataSource(), 12, 1), listName: 'List' },
        { ...getCheckBoxGroup('TechniqueUIDs', '感兴趣的光谱技术', getTechniqueServiceDataSource(), 13, 1), listName: 'List' },
        { ...getTextBox2('Description', '描述', 7, 1, '（可选填）'), type: 'Ckeditor4' },
        { ...getTextBox2('RealContent', '内容', 8, 1, '（可选填）'), type: 'Ckeditor4' },
        getButtonView()
    ]
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

function getTypeDataSource() {
    return [
        { value: 0, text: '运营技能' },
        { value: 1, text: '软件技能' },
        { value: 2, text: '研究经验' },
        { value: 3, text: '其他' }
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
        editView: "experienceEditEdit"
    },
    {
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "experienceEditEdit",
        successCallback: 'saveEntityDataCallback'
    },
    {
        name: "deleteEntityData",
        type: "entityEdit/deleteEntityData",
        dataActionType: dataActionTypes.deleteEntityData,
        backUrl: '/integral/get?tabPage=1',
        successTip: "删除成功!",
        confirmTip: "确认要删除吗?"
    }]
}