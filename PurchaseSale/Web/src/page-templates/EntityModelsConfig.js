export default (name) => {
    return {
        Name: name + "Service",
        ServiceName: "ApiService",
        ActionList: [
            post("SearchQuery", name, "SearchQuery", "View" + name, true),
            post("Insert", name, "SaveEntityData", null, true, true),
            put("Update", name, "SaveEntityData", null, true, true),
            delete2("Delete", name, "DeleteEntityData", null, true, true),
            get("GetEntityData", name, "GetEntityData", name, true)
        ]
    }
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