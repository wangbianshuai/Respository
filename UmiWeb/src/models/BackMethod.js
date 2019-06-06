import DvaIndex from "DvaCommon";

const config = {
    Name: "BackMethodService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "backmethod/getdatalist", "DataList", "data"),
        post("Insert", "backmethod/insert", "SaveEntityData", "data"),
        post("Update", "backmethod/update", "SaveEntityData", "data"),
        post("Delete", "backmethod/delete", "DeleteEntityData", "data"),
        post("GetData", "backmethod/getdata", "EntityData", "data"),
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);