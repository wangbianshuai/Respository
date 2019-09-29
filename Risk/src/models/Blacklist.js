import DvaIndex from "DvaCommon";

const config = {
    Name: "BlacklistService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "loancustomer/blacklist/query", "DataList", "data", true),
        post("Insert", "loancustomer/blacklist/add", "SaveEntityData", null, true, true),
        post("Update", "loancustomer/blacklist/modify", "SaveEntityData", null, true, true),
        post("Delete", "loancustomer/blacklist/delete", "DeleteEntityData", null, true, true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);