import DvaIndex from "DvaCommon";

const config = {
    Name: "CreditService",
    ServiceName: "ApiService",
    ActionList: [
        //获取征信信息
        post("GetCreditInfo", "GetCreditInfo", "GetCreditInfo", "data"),
        //保存征信信息
        post("SaveCreditInfo", "SaveCreditInfo", "SaveCreditInfo", "data"),
        //计算授信额度
        post("ComputeCreditQuota", "ComputeCreditQuota", "ComputeCreditQuota", "data"),
        //计算授信额度
        post("GetCreditQuota", "GetCreditQuota", "GetCreditQuota", "data")
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);