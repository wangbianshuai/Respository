const { getSpanText, getDateIconText, getHtmlContent } = require('../../common');

//chance/job 1400-1499
const dataActionTypes = {
    //get entity data
    getEntityData: 1400,
    //Save entity data
    saveEntityData: 1401
};

const entity = { name: 'Job', primaryKey: 'UID' };

module.exports = {
    name: "job",
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
        name: "jobEdit",
        type: "View",
        isDiv: true,
        className: 'divDetail2',
        entity: entity,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'Opportunity_GetSingleJobReleaseInfo',
            dataPrimaryKey: 'JobReleaseUID'
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
        getSpanText('JobName', 'divTitle'),
        getLabelText('Address', '公司/院校'),
        getLabelText('ContactPerson', '部门/院系'),
        getLabelText('Email', '邮箱'),
        getLabelText('CityName', '城市'),
        getLabelText('CreatedDate', '发布日期'),
        getLabelText('ExpirationDate', '信息有效期'),
        getLabelText2('DescriptionTitle', '职位描述'),
        getHtmlContent('Description', 'divContent'),
        getLabelText2('CompanyInfoTitle', '公司介绍'),
        getHtmlContent('CompanyInfo', 'divContent'),
    ]
}

function getLabelText(name, label) {
    return { ...getSpanText(name, 'divInfoText'), label: label + '：' }
}

function getLabelText2(name, label) {
    return { ...getSpanText(name, 'divInfoTitle'), label: label + '：' }
}


function getEventActions() {
    return [{
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "jobEdit"
    }]
}

