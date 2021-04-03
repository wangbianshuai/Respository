import DvaIndex from "DvaCommon";

const config = {
    name: 'ImageService',
    serviceName: 'ImageService',
    actionList: [
        post('uploadFile', 'upload', 'uploadFile'),
    ]
}

function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", isFormData: true, stateName, dataKey }
}

export default DvaIndex(config);
