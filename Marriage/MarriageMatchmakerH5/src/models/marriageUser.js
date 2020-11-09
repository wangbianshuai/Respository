import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageUserService',
    serviceName: 'ApiService',
    actionList: [
        //获取用户信息
        post('getUserInfo', 'MarriageUser/GetUserInfo', 'getUserInfo'),
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
