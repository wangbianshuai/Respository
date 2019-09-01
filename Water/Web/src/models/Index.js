import DvaIndex from "DvaCommon";

const config = {
    Name: "ApiService",
    ServiceName: "ApiService",
    ActionList: [
        post("Login", "User/Login", "Login", "Login")
    ]
}

function post(actionName, url, stateName, dataKey) {
    return { ActionName: actionName, Url: url, Method: "POST", StateName: stateName, DataKey: dataKey }
}

export default DvaIndex(config);