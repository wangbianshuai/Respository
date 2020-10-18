import DvaIndex from "DvaCommon";

const config = {
    name: 'ActivityService',
    serviceName: 'A2ApiService',
    actionList: [
        post('getEntityData', 'Handlers/CommonHandler.ashx', 'getEntityData', 'data'),
        post('saveEntityData', 'Handlers/CommonHandler.ashx', 'saveEntityData', 'data'),
        post('getFormConfig', 'Handlers/CommonHandler.ashx', 'getFormConfig', 'data'),
        post('getContentPage', 'Handlers/CommonHandler.ashx', 'getContentPage', 'data'),
        post('getWxFanOpenId', 'Handlers/CommonHandler.ashx', 'getWxFanOpenId', 'data'),
        post('judgeFollowPublicAccount', 'Handlers/CommonHandler.ashx', 'judgeFollowPublicAccount', 'data')
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, isFormData: true, isCors: true, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
