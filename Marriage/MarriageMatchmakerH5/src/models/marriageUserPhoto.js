import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageUserPhotoService',
    serviceName: 'ApiService',
    actionList: [
        //获取用户照片信息
        post('getEntityData', 'MarriageUserPhoto/GetUserPhotoByMatchmaker', 'getEntityData')
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
