import DvaIndex from "DvaCommon";

const config = {
    name: 'WxUserService',
    serviceName: 'ApiService',
    actionList: [
        //获取WxUser
        post('getWxUser', 'WxUser/GetWxUser', 'getWxUser', 'Data')
    ]
}

function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
