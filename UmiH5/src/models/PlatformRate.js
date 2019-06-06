import DvaIndex from "DvaCommon";

const config = {
    Name: "PlatformRateService",
    ServiceName: "ApiService",
    ActionList: [
        post("GetDataList", "platformrate/getdatalist", "DataList", "data"),
        post("Insert", "platformrate/insert", "SaveEntityData", "data"),
        post("Update", "platformrate/update", "SaveEntityData", "data"),
        post("Delete", "platformrate/delete", "DeleteEntityData", "data"),
        post("GetData", "platformrate/getdata", "EntityData", "data"),
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);