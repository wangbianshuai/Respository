import DvaIndex from "DvaCommon";

const config = {
    Name: "UserService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "User/getdatalist", "DataList", "data"),
        post("Insert", "User/insert", "SaveEntityData", "data"),
        post("Update", "User/update", "SaveEntityData", "data"),
        post("Delete", "User/delete", "DeleteEntityData", "data"),
        post("GetData", "User/getdata", "EntityData", "data"),
        post("GetUserList", "getuserlist", "UserList", "data")
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);