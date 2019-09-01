import DvaIndex from "DvaCommon";

const config = {
    Name: "FileCenterService",
    ServiceName: "FileCenterApiService",
    ActionList: [
        postFormData("UploadFiles", null, "UploadFiles", "data"),
        get("GetFiles", null, "Files", "data")
    ]
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}

function postFormData(actionName, url, stateName, dataKey, isToken) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: true, IsFormData: true }
}

export default DvaIndex(config);
