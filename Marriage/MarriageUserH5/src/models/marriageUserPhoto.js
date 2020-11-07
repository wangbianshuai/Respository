import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageUserPhotoService',
    serviceName: 'ApiService',
    actionList: [
        //保存照片
        post('savePhoto', 'MarriageUserPhoto/SaveUserPhoto', 'savePhoto'),
        //获取用户照片信息
        post('getEntityData', 'MarriageUserPhoto/GetUserPhotos', 'getEntityData'),
        //删除用户照片信息
        post('deletePhoto', 'MarriageUserPhoto/DeleteUserPhoto', 'deletePhoto')
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
