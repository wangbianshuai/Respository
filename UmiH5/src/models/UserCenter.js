import DvaIndex from "DvaCommon";

const config = {
    Name: "UserCenterService",
    ServiceName: "UserCenterApiService",
    ActionList: [
        //获取公司行业类型
        post("GetAllIndustry", "company/edt/queryAllIndustry", "GetAllIndustry", "data")
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);