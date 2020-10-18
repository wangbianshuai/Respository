import DvaIndex from "DvaCommon";

const config = {
    name: 'UserService',
    serviceName: 'ApiService',
    actionList: [
        post("getBannersList", "Handler.ashx", "getBannersList", 'Data'),
        post("getCountryCodeList", "CommonHandler.ashx", "getCountryCodeList", 'Data'),
        post("getRandomUID", "CommonHandler.ashx", "getRandomUID", 'Data'),
        post("sendSms", "Handler.ashx", "sendSms", 'Data'),
        post("login", "Handler.ashx", "login", 'Data'),
        post("forgotPassword", "Handler.ashx", "forgotPassword", 'Data'),
        post("register", "Handler.ashx", "register", 'Data'),
        post("verifyCallNumberCode", "Handler.ashx", "verifyCallNumberCode", 'Data'),
        post("checkIsExistFavorites", "Handler.ashx", "checkIsExistFavorites", 'Data', false, false, true),
        //收藏与取消收藏
        post('collect', 'Handler.ashx', 'collect', 'Data', true),
        post('getEntityData', 'Handler.ashx', 'getEntityData', 'Data', false, true),
        post('saveEntityData', 'Handler.ashx', 'saveEntityData', 'Data', false, true),
        post("getCountryProvinceCityList", "CommonHandler.ashx", "getCountryProvinceCityList", 'Data'),
        post('applyUserAccount', 'Handler.ashx', 'applyUserAccount', 'Data', false, true),
        post('quitUserAccount', 'Handler.ashx', 'quitUserAccount', 'Data', false, true),
        post('getInfo', 'Handler.ashx', 'getInfo', 'Data', false, true),
        post('changePassword', 'Handler.ashx', 'changePassword', 'Data', false, true),
        post('changeCell', 'Handler.ashx', 'changeCell', 'Data', false, true),
        post('getFavorites', 'Handler.ashx', 'getFavorites', 'Data', false, true),
        post('uploadHeadImage', 'Handler.ashx', 'uploadHeadImage', 'Data', false, true),
        post('getLabProductList', 'Handler.ashx', 'getLabProductList', 'Data', false, true),
        post('getSingleSysSettingInfo', 'Handler.ashx', 'getSingleSysSettingInfo', 'Data'),
        post('getRecommendActivities', 'Handler.ashx', 'getRecommendActivities', 'Data', false, true),
        post('getLabUsers', 'Handler.ashx', 'getLabUsers', 'Data', false, true),
        post('getLabUser', 'Handler.ashx', 'getLabUser', 'Data', false, true),
        post('passLabUserApply', 'Handler.ashx', 'passLabUserApply', 'Data', false, true),
        post('rejectLabUserApply', 'Handler.ashx', 'rejectLabUserApply', 'Data', false, true),
        post('getCollaborationInfo', 'Handler.ashx', 'getCollaborationInfo', 'Data', false, true),
        post('savePartnerLab', 'Handler.ashx', 'savePartnerLab', 'Data', false, true),
        post('searchJob', 'Handler.ashx', 'searchJob', 'Data', false, true),
        post('getJob', 'Handler.ashx', 'getJob', 'Data', false, true),
        post('saveJob', 'Handler.ashx', 'saveJob', 'Data', false, true),
    ]
}
function post(actionName, url, stateName, dataKey, isToken, hasToken, isTokenAccess) {
    return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, isToken, hasToken, isTokenAccess }
}

export default DvaIndex(config);
