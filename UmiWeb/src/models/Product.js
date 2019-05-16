import DvaIndex from "DvaCommon";

const config = {
    Name: "ProductService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "product/getdatalist", "DataList", "data"),
        post("Insert", "product/insert", "SaveEntityData", "data"),
        post("Update", "product/update", "SaveEntityData", "data"),
        post("GetData", "product/getdata", "EntityData", "data"),
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);