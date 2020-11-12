import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageUserService',
    serviceName: 'ApiService',
    actionList: [
        //查询红娘下相亲人员列表
        post('searchQuery', 'MarriageUser/QueryUsersByMatchmaker', 'searchQuery'),
        //查询红娘下相亲人员列表
        post('searchBoy', 'MarriageUser/QueryUsersByMatchmaker', 'searchBoy'),
        //查询红娘下相亲人员列表
        post('searchGirl', 'MarriageUser/QueryUsersByMatchmaker', 'searchGirl'),
        //查询红娘下相亲人员列表
        post('searchNoPass', 'MarriageUser/QueryUsersByMatchmaker', 'searchNoPass'),
        //获取红娘下用户信息
        post('getUserByMatchmaker', 'MarriageUser/GetUserByMatchmaker', 'getUserByMatchmaker'),
        //获取红娘下用户条件类型
        post('getUserConditionTypeByMatchmaker', 'MarriageUser/GetUserConditionTypeByMatchmaker', 'getUserConditionTypeByMatchmaker'),
        //获取红娘下用户条件类型列表
        post('getUserConditionTypesByMatchmaker', 'MarriageUser/GetUserConditionTypesByMatchmaker', 'getUserConditionTypesByMatchmaker', 'DataList'),
        //获取红娘下用户信息
        post('getEntityData', 'MarriageUser/GetUserInfoByMatchmaker', 'getEntityData', 'UserInfo'),
        //更新红娘下用户状态
        post('updateUserStatusByMatchmaker', 'MarriageUser/UpdateUserStatusByMatchmaker', 'updateUserStatusByMatchmaker')
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
