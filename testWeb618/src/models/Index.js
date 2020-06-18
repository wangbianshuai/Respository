import DvaIndex from "DvaCommon";

const config = {
    Name: "ApiService",
    ServiceName: "ApiService",
    ActionList: [
        post("Login", "AdminUser/Login", "Login", "Login"),
        post("ChangePassword", "AdminUser/ChangePassword", "ChangePassword", "ChangePassword", true)
    ]
}

function post(actionName, url, stateName, dataKey, IsToken) {
    return { ActionName: actionName, Url: url, Method: "POST", StateName: stateName, DataKey: dataKey, IsToken }
}

export default DvaIndex(config);