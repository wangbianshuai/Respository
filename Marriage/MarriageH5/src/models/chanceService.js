import DvaIndex from "DvaCommon";

const config = {
    name: 'ChanceService',
    serviceName: 'ApiService',
    actionList: [
        post("getBannersList", "Handler.ashx", "getBannersList", 'Data'),
        post('getTopPartners', 'Handler.ashx', 'getTopPartners', 'Data'),
        post('getTopJobs', 'Handler.ashx', 'getTopJobs', 'Data'),
        //合作伙伴
        post("searchQuery", "Handler.ashx", "searchQuery", 'Data'),
        //人才招募
        post("searchJob", "Handler.ashx", "searchJob", 'Data'),
        post('getEntityData', 'Handler.ashx', 'getEntityData', 'Data')
    ]
}
function post(actionName, url, stateName, dataKey, isToken) {
    return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, isToken }
}

export default DvaIndex(config);
