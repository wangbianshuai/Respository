const { getSpanText, getHtmlContent, getIconText } = require('../../common');

//chance/partner 1500-1599
const dataActionTypes = {
    //get entity data
    getEntityData: 1500,
    //Save entity data
    saveEntityData: 1501
};

const entity = { name: 'Partner', primaryKey: 'UID' };

module.exports = {
    name: "partner",
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
        name: "partnerEdit",
        type: "RowsColsView",
        isDiv: true,
        className: 'divDetail2',
        entity: entity,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'Opportunity_GetSingleCollaborationInfo',
            dataPrimaryKey: 'ApplicationUID'
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
        tabs: [{ title: '合作伙伴', url: "/chance/list?tabPage=0" },
        { title: '人才招募', url: "/chance/list?tabPage=1" },
        { title: '技术转让', url: "/chance/list?tabPage=2" }]
    }
}

function getProperties() {
    return [
        getSpanText('Company', 'divTitle', 1, 1),
        getIconText('CityName', 'city.png', 'divCity', 2, 1),
        getIconText('Email', 'mail.png', 'divMail', 2, 2),
        getIconText('Telephone', 'phone.png', 'divPhone', 2, 3),
        getHtmlContent('Description', 'divContent', 3, 1)
    ]
}


function getEventActions() {
    return [{
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "partnerEdit"
    }]
}

