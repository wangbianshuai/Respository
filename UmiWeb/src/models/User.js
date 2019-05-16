import DvaIndex from "DvaCommon";

const config = {
    Name: "ApiService",
    ServiceName: "ApiService",
    ActionList: [
        get2("GetNow", "System/GetNow", "Now", "Now"),
        post("GetOrderList", "getorderlist", "OrderList", "data"),
        post("GetUserList", "getuserlist", "UserList", "data"),
        post("GetOrderStatusLogs", "GetOrderStatusLogs", "OrderStatusLogs", "data"),
    ]
}

function get2(actionName, url, stateName, dataKey) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey }
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);