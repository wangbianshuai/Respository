import DvaIndex from "DvaCommon";

const config = {
    Name: "EloanService",
    ServiceName: "EloanApiService",
    ActionList: [
        post("Query", "eloan_queryCreditInterface.htm", "EloanQuery", "data"),
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);
