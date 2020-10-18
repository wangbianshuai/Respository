const { getSpanText, getDateIconText, getHtmlContent, getIconText } = require('../../common');

//detail/activity 900-999
const dataActionTypes = {
    //get entity data
    getEntityData: 900,
    //Save entity data
    saveEntityData: 901
};

const entity = { name: 'Spectral', primaryKey: 'UID' };

module.exports = {
    name: "activity",
    type: "View",
    eventActions: getEventActions(),
    properties: [getTabs(), getEditView()]
}

function getEditView() {
    return {
        name: "editView",
        type: "View",
        isDiv: true,
        className: 'divDetail',
        properties: [getEditView2(), getActivityContentPage()]
    }
}

function getActivityContentPage() {
    return { type: "activityContentPage", name: "activityContentPage", className: 'divActivityContentPage' }
}

function getEditView2() {
    return {
        name: "activityEdit",
        type: "RowsColsView",
        isDiv: true,
        className: 'divDetail2',
        entity: entity,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'OpticalSchool_GetSingleActivityInfo',
            dataPrimaryKey: 'ActivityUID'
        },
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: getProperties()
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

function getProperties() {
    return [
        getSpanText('ActivityName', 'divTitle', 1, 1),
        { ...getDateIconText('StartEndDate', 'divDate2', 2, 1) },
        { name: 'favoritesStart', type: 'FavoritesStar', x: 2, y: 2, articleType: 30, className: 'divStar2' },
        getIconText('Address', 'address.png', 'divAddress', 3, 1),
        getHtmlContent('Contents', 'divContent', 4, 1)
    ]
}


function getEventActions() {
    return [{
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "activityEdit",
        setGetEntityDataLoad: 'setGetEntityDataLoad'
    }]
}

