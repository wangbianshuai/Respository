import DvaIndex from "DvaCommon";

const config = {
    name: 'ExperienceService',
    serviceName: 'ApiService',
    actionList: [
        post('getEntityData', 'Handler.ashx', 'getEntityData', 'Data', false, true),
        post('saveEntityData', 'Handler.ashx', 'saveEntityData', 'Data', false, true),
        post('deleteEntityData', 'Handler.ashx', 'deleteEntityData', 'Data', false, true),
    ]
};

function post(actionName, url, stateName, dataKey, hasToken, isToken) {
    return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, hasToken, isToken }
}

export default DvaIndex(config);