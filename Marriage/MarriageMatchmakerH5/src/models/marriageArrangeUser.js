import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageArrangeUserService',
    serviceName: 'ApiService',
    actionList: [
        //获取红娘下用户信息
        post('getUserByMatchmaker', 'MarriageArrangeUser/GetUserByMatchmaker', 'getUserByMatchmaker'),
        //获取红娘下用户条件类型
        post('getUserConditionTypeByMatchmaker', 'MarriageArrangeUser/GetUserConditionTypeByMatchmaker', 'getUserConditionTypeByMatchmaker'),
        //获取红娘下用户条件类型列表
        post('getUserConditionTypesByMatchmaker', 'MarriageArrangeUser/GetUserConditionTypesByMatchmaker', 'getUserConditionTypesByMatchmaker', 'DataList'),
        //获取红娘下用户信息
        post('getEntityData', 'MarriageArrangeUser/GetUserInfoByMatchmaker', 'getEntityData', 'UserInfo'),
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
