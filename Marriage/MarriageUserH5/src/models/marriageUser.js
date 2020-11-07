import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageUserService',
    serviceName: 'ApiService',
    actionList: [
        //注册
        post('saveEntityData', 'MarriageUser/Register', 'saveEntityData', 'Data'),
        //以openId获取用户
        post('getUserByOpenId', 'MarriageUser/GetUserByOpenId', 'getUserByOpenId', 'Data'),
        //获取用户信息
        post('getUser', 'MarriageUser/GetUser', 'getUser'),
        //获取用户信息
        post('getEntityData', 'MarriageUser/GetUserInfo', 'getEntityData', 'UserInfo'),
        //更新用户信息
        post('updateUserInfo', 'MarriageUser/UpdateUserInfo', 'updateUserInfo'),
        //获取用户条件类型列表
        post('getUserConditionTypes', 'MarriageUser/getUserConditionTypes', 'getUserConditionTypes', 'DataList')
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
