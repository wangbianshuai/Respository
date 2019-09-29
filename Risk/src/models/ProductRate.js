import DvaIndex from "DvaCommon";

const config = {
    Name: "ProductRateService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "loanproduct/interestRate/query", "DataList", "data", true),
        post("Insert", "loanproduct/interestRate/add", "SaveEntityData", null, true, true),
        post("Delete", "loanproduct/interestRate/delete", "DeleteEntityData", null, true, true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);