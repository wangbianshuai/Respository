import DvaIndex from "DvaCommon";

const config = {
    name: 'WxUserService',
    serviceName: 'ApiService',
    actionList: [
        //getOpenIdSetting
        post('getOpenIdSetting', 'formData', 'getOpenIdSetting', ''),
        //获取WxUser
        post('getWxUser', 'formData', 'getWxUser', '')
    ]
}

function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", isFormData: true, stateName, dataKey }
}

export default DvaIndex(config);
