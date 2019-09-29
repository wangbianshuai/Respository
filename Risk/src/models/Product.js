import DvaIndex from "DvaCommon";

const config = {
    Name: "ProductService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "loanproduct/product/query", "DataList", "data", true),
        post("Insert", "loanproduct/product/add", "SaveEntityData", null, true, true),
        post("Update", "loanproduct/product/modify", "SaveEntityData", null, true, true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);