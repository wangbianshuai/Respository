import DvaIndex from "DvaCommon";

const config = {
    Name: "UserService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "useraccess/user/queryUserList", "DataList", "data", true),
        post("Insert", "useraccess/user/addUser", "SaveEntityData", null, true, true),
        { ...post("GetData", "useraccess/user/queryUserBaseInfo", "GetData", "data", true), IsLoading: false },
        post("GetUserList", "workOrder/workOrderQuery/queryQransformOrDeliveryUsers", "UserList", "data", true),
        post("GetRoleUserList", "useraccess/role/queryUsersByRole", "RoleUserList", "data", true),
        post("GetRoleConfig", "useraccess/role/queryRolesByUser", "GetRoleConfig", "data", true),
        post("SaveRoleConfig", "useraccess/role/configRoleToUser", "SaveRoleConfig", null, true, true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);