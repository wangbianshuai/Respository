import DvaIndex from "DvaCommon";

const config = {
    Name: "ApplicationService",
    ServiceName: "ApiService",
    ActionList: [
        post("SearchQuery", "Application", "SearchQuery", "Application", true),
        post("Insert", "Application", "SaveEntityData", null, true, true),
        put("Update", "Application", "SaveEntityData", null, true, true),
        delete2("Delete", "Application", "DeleteEntityData", null, true, true),
        get("GetEntityData", "Application", "GetEntityData", "Application", true)
    ]
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

function put(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, Method: "PUT", DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

function delete2(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, Method: "DELETE", DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);