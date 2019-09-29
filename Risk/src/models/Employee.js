import DvaIndex from "DvaCommon";

const config = {
    Name: "EmployeeService",
    ServiceName: "EmployeeApiService",
    ActionList: [
        //登录
        { ...post("Login", "auth/login", "Login", "data"), IsLoading: false },
        //退出登录
        { ...post("Logout", "auth/logout", "Logout", "data", true), IsLoading: false },
        get("GetEmployeeList", "services/uaa/api/accounts", "EmployeeList", "data", true),
        { ...get("GetData", "services/uaa/api/account", "GetData", "data", true), IsLoading: false },
    ]
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}
function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);