import DvaIndex from "DvaCommon";

const config = {
    Name: "MenuUserService",
    ServiceName: "ApiService",
    ActionList: [
        //获取用户菜单权限
        post("GetUserMenuRight", "api/GetUserMenuRight", "GetUserMenuRight", "data", true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);