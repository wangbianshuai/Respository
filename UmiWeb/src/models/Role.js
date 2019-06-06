import DvaIndex from "DvaCommon";

const config = {
    Name: "RoleService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "role/getdatalist", "DataList", "data"),
        post("Insert", "role/insert", "SaveEntityData", "data"),
        post("Update", "role/update", "SaveEntityData", "data"),
        post("Delete", "role/delete", "DeleteEntityData", "data"),
        post("GetData", "role/getdata", "EntityData", "data"),
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);