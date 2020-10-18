import DvaIndex from "DvaCommon";

const config = {
    name: 'SysSettingService',
    serviceName: 'ApiService',
    actionList: [
        //获取实体数据
        post('getEntityData', 'Handler.ashx', 'getEntityData', 'Data'),
    ]
}
function post(actionName, url, stateName, dataKey, hasToken, isToken) {
    return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, hasToken, isToken }
}

export default DvaIndex(config);
