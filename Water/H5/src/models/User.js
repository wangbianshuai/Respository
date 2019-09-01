import DvaIndex from "DvaCommon";

const config = {
    Name: "UserService",
    ServiceName: "ApiService",
    ActionList: [
        { ...post("GetData", "useraccess/user/queryUserBaseInfo", "GetData", "data", true), IsLoading: false },
		{ ...post("GetRoles", "useraccess/role/queryRolesByUser", "GetRoles", "data"), IsLoading: false },
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);