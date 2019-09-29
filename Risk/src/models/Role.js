import DvaIndex from "DvaCommon";

const config = {
    Name: "RoleService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "useraccess/role/query", "DataList", "data", true),
        post("Insert", "useraccess/role/add", "SaveEntityData", null, true, true),
        post("Update", "useraccess/role/modify", "SaveEntityData", null, true, true),
        post("Delete", "useraccess/role/delete", "DeleteEntityData", null, true, true),
        post("GetRightConfig", "useraccess/permission/queryRolePermissionTree", "GetRightConfig", "data", true),
        post("UpdateRightConfig", "useraccess/permission/configPermissionToRole", "UpdateRightConfig", null, true, true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);