const { getSpanText, getDateIconText, getHtmlContent } = require('../../common');

//detail/experience 1000-1099
const dataActionTypes = {
    //get entity data
    getEntityData: 1000,
    //Save entity data
    saveEntityData: 1001
};

const entity = { name: 'Spectral', primaryKey: 'UID' };

module.exports = {
    name: "experience",
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
        properties: [getEditView2()]
    }
}

function getEditView2() {
    return {
        name: "experienceEdit",
        type: "RowsColsView",
        isDiv: true,
        className: 'divDetail2',
        entity: entity,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'OpticalSchool_GetSingleResearchExInfo',
            dataPrimaryKey: 'ResearchExUID'
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
        getSpanText('Title', 'divTitle', 1, 1),
        { ...getDateIconText('CreatedDate', 'divDate', 2, 1) },
        { name: 'favoritesStart', type: 'FavoritesStar', x: 2, y: 2, articleType: 20 },
        { ...getHtmlContent('RealContent', 'divContent', 3, 1), type: 'RealContent' }
    ]
}


function getEventActions() {
    return [{
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "experienceEdit",
        setGetEntityDataLoad: 'setGetEntityDataLoad'
    }]
}

