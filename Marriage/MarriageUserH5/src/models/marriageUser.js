import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageUserService',
    serviceName: 'ApiService',
    actionList: [
        //注册
        post('saveEntityData', 'MarriageUser/Register', 'saveEntityData', 'Data'),
        //以openId获取用户
        post('getUserByOpenId', 'MarriageUser/GetUserByOpenId', 'getUserByOpenId', 'Data'),
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);