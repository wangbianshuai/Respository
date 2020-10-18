import DvaIndex from "DvaCommon";

const config = {
    name: 'DocumentService',
    serviceName: 'ApiService',
    actionList: [
        post('getEntityData', 'Handler.ashx', 'getEntityData', 'Data', false, true),
        post('saveEntityData', 'Handler.ashx', 'saveEntityData', 'Data', false, true),
        post('deleteEntityData', 'Handler.ashx', 'deleteEntityData', 'Data', false, true),
        post('getFilesUID', 'Handler.ashx', 'getFilesUID', 'Data', false, true),
        post('downloadFile', 'Handler.ashx', 'downloadFile', 'Data', false, true),
        post('uploadFile', 'Handler.ashx', 'uploadFile', 'Data', false, true),
        post('deleteFile', 'Handler.ashx', 'deleteFile', 'Data', false, true),
    ]
};

function post(actionName, url, stateName, dataKey, hasToken, isToken) {
    return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, hasToken, isToken }
}

export default DvaIndex(config);