import DvaIndex from "DvaCommon";

const config = {
    Name: "BackMethodService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "loanproduct/repayWay/query", "DataList", "data", true),
        post("Insert", "loanproduct/repayWay/add", "SaveEntityData", null, true, true),
        post("Delete", "loanproduct/repayWay/delete", "DeleteEntityData", null, true, true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);