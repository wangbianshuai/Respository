import DvaIndex from "DvaCommon";

const config = {
    Name: "PlatformRateService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "loanproduct/fee/query", "DataList", "data", true),
        post("GetFineRateList", "loanproduct/fee/query", "FineRateList", "data", true),
        post("GetInfoManageRateList", "loanproduct/fee/query", "InfoManageRateList", "data", true),
        post("GetInfoServiceRateList", "loanproduct/fee/query", "InfoServiceRateList", "data", true),
        post("Insert", "loanproduct/fee/add", "SaveEntityData", null, true, true),
        post("Delete", "loanproduct/fee/delete", "DeleteEntityData", null, true, true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);