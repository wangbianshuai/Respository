import DvaIndex from "DvaCommon";

const config = {
    Name: "ApiService",
    ServiceName: "ApiService",
    ActionList: [
        post("Login", "User/Login", "Login", "Login"),
        post("ChangePassword", "User/ChangePassword", "ChangePassword", "ChangePassword", true)
    ]
}

function post(actionName, url, stateName, dataKey, IsToken) {
    return { ActionName: actionName, Url: url, Method: "POST", StateName: stateName, DataKey: dataKey, IsToken }
}

export default DvaIndex(config);