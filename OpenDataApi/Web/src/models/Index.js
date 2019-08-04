import DvaIndex from "DvaCommon";

const config = {
    Name: "ApiService",
    ServiceName: "ApiService",
    ActionList: [
        get2("GetNow", "System/GetNow", "Now", "Now")
    ]
}

function get2(actionName, url, stateName, dataKey) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey }
}

export default DvaIndex(config);