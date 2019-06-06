import DvaIndex from "DvaCommon";

const config = {
    Name: "EmployeeService",
    ServiceName: "ApiService",
    ActionList: [
        //登录
        post("Login", "api/login", "Login", "data", false, true),
        //退出登录
        post("Logout", "api/logout", "Logout", "data")
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);