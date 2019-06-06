import DvaIndex from "DvaCommon";

const config = {
    Name: "BlacklistService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "blacklist/getdatalist", "DataList", "data"),
        post("Insert", "blacklist/insert", "SaveEntityData", "data"),
        post("Update", "blacklist/update", "SaveEntityData", "data"),
        post("Delete", "blacklist/delete", "DeleteEntityData", "data"),
        post("GetData", "blacklist/getdata", "EntityData", "data"),
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);