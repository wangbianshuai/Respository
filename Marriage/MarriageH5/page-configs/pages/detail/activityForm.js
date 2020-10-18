const entity = { name: 'Activity', primaryKey: 'UID' };

module.exports = {
    name: "activityForm",
    type: "View",
    eventActions: getEventActions(),
    properties: [getTabs(), getEditFormView()]
}

function getEditFormView() {
    return {
        name: "editFormView",
        type: "View",
        isDiv: true,
        className: 'divDetail',
        properties: [getEditView2(), getResultView()]
    }
}

function getTabs() {
    return {
        name: 'tabs1',
        type: 'Tabs',
        isDiv: true,
        className: 'tabDetail',
        tabs: [{ title: '活动', url: "/spectral/list?tabPage=0" },
        { title: '科研经验', url: "/spectral/list?tabPage=1" },
        { title: '云课堂', url: "/spectral/list?tabPage=2" },
        { title: '工具', url: "/spectral/list?tabPage=3" }]
    }
}

function getResultView() {
    return {
        name: "resultView",
        type: "View",
        isDiv: true,
        isVisible: false,
        className: 'divResult',
        properties: [{ name: 'resultContent', type: 'HtmlContent', className: 'divResultContent' }]
    }
}

function getEditView2() {
    return {
        name: "editView",
        type: "activityFormPage",
        isList: true,
        entity: entity,
        className: 'divActivity',
        formData: {
            Param: {},
            Act: 'Event_CreateEventsFormRecord',
        },
        properties: []
    }
}

function getEventActions() {
    return [{
        name: "saveEntityData",
        type: "entityEdit/saveEntityData",
        editView: "editView",
        expandSetEntityData: 'expandSetEntityData',
        successCallback: 'saveEntityDataCallback'
    }]
}