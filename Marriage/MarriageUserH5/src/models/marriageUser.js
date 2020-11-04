import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageUserService',
    serviceName: 'ApiService',
    actionList: [
        //注册
        post('saveEntityData', 'MarriageUser/Register', 'saveEntityData', 'data')
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
