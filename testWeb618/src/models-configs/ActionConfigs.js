export default {
    GetServiceInterfaces: get("GetServiceInterfaces", "ViewServiceInterface?$select=ServiceInterfaceId,Name&$orderby CreateDate", "ServiceInterfaces", "ViewServiceInterface"),
    UpdateAppAccountStatus: post("UpdateAppAccountStatus", "AppAccount/Update", "UpdateStatus", "", true),
    RequestServiceLogReSend: post("ReSend", "RequestServiceLog/ReSend", "ReSend", "", true),
}

function post(actionName, url, stateName, dataKey, IsToken) {
    return { ActionName: actionName, Url: url, Method: "POST", StateName: stateName, DataKey: dataKey, IsToken }
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}