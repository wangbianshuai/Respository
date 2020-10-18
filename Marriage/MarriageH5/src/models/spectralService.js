import DvaIndex from "DvaCommon";

const config = {
    name: 'SpectralService',
    serviceName: 'ApiService',
    actionList: [
        post("getBannersList", "Handler.ashx", "getBannersList", 'Data'),
        post('getTopActivities', 'Handler.ashx', 'getTopActivities', 'Data', true),
        post('getTopExperiences', 'Handler.ashx', 'getTopExperiences', 'Data', true),
        post('getTopVideos', 'Handler.ashx', 'getTopVideos', 'Data', true),
        //活动
        post("searchQuery", "Handler.ashx", "searchQuery", 'Data', true),
        //科研经验
        post("searchExperience", "Handler.ashx", "searchExperience", 'Data', true),
        //云课堂
        post("searchVideo", "Handler.ashx", "searchVideo", 'Data', true),
        //获取实体数据
        post('getEntityData', 'Handler.ashx', 'getEntityData', 'Data', true),
        //获取应用领域
        post('getApplications', 'CommonHandler.ashx', 'getApplications', 'Data'),
        //获取光谱技术
        post('getTechniques', 'CommonHandler.ashx', 'getTechniques', 'Data'),
        //获取区域
        post('getAreas', 'CommonHandler.ashx', 'getAreas', 'Data'),
        //获取推荐视频
        post('getVideoRelations', 'Handler.ashx', 'getVideoRelations', 'Data', true)
    ]
}
function post(actionName, url, stateName, dataKey, hasToken, isToken) {
    return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, hasToken, isToken }
}

export default DvaIndex(config);
