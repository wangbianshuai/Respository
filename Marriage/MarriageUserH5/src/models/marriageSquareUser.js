import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageSquareUserService',
    serviceName: 'ApiService',
    actionList: [
        //获取用户下用户信息
        post('getUserByUser', 'MarriageSquareUser/GetUserByUser', 'getUserByUser'),
        //获取用户下用户条件类型
        post('getUserConditionTypeByUser', 'MarriageSquareUser/GetUserConditionTypeByUser', 'getUserConditionTypeByUser'),
        //获取用户下用户条件类型列表
        post('getUserConditionTypesByUser', 'MarriageSquareUser/GetUserConditionTypesByUser', 'getUserConditionTypesByUser', 'DataList'),
        //获取用户下用户信息
        post('getEntityData', 'MarriageSquareUser/GetUserInfoByUser', 'getEntityData', 'UserInfo'),
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);