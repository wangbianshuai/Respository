const { getHtmlContent, getSpanText } = require('../../common');

//integral/policy 2200-2299
const dataActionTypes = {
    //get entity data
    getEntityData: 2200,
    //Save entity data
    saveEntityData: 2201
};

const entity = { name: 'SysSetting', primaryKey: 'ParamID', isNumber: true };

module.exports = {
    name: "policy",
    type: "View",
    isDiv: true,
    className: 'divView3',
    eventActions: getEventActions(),
    properties: [getTitle(), getEditView()]
}

function getTitle() {
    return { ...getSpanText('title', 'divTopTitle'), text: '积分政策', isBottomLine: true }
}

function getEditView() {
    return {
        name: "policyEdit",
        type: "View",
        entity: entity,
        eventActionName: "getEntityData",
        formData: {
            Param: {},
            Act: 'SysSetting_GetSingleSysSettingInfo',
        },
        getEntityDataActionType: dataActionTypes.getEntityData,
        properties: getProperties()
    }
}

function getProperties() {
    return [
        getHtmlContent('SysValue08', 'divPolicy'),
    ]
}

function getEventActions() {
    return [{
        name: "getEntityData",
        type: "entityEdit/getEntityData",
        editView: "policyEdit"
    }]
}