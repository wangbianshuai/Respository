import DvaIndex from "DvaCommon";

const config = {
    Name: "ProductRateService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "productrate/getdatalist", "DataList", "data"),
        post("Insert", "productrate/insert", "SaveEntityData", "data"),
        post("Update", "productrate/update", "SaveEntityData", "data"),
        post("Delete", "productrate/delete", "DeleteEntityData", "data"),
        post("GetData", "productrate/getdata", "EntityData", "data"),
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);