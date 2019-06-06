import DvaIndex from "DvaCommon";

const config = {
    Name: "FinanceService",
    ServiceName: "ApiService",
    ActionList: [
        //获取公司财务信息
        post("GetCompanyFinanceInfo", "GetCompanyFinanceInfo", "GetCompanyFinanceInfo", "data"),
        //保存公司财务信息
        post("SaveCompanyFinanceInfo", "SaveCompanyFinanceInfo", "SaveCompanyFinanceInfo", "data"),
        //计算汇总数据
        post("ComputeCollectBankInfo", "ComputeCollectBankInfo", "ComputeCollectBankInfo", "data")
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);

