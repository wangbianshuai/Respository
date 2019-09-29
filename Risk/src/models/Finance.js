import DvaIndex from "DvaCommon";

const config = {
    Name: "FinanceService",
    ServiceName: "ApiService",
    ActionList: [
        //获取公司财务信息
        post("GetCompanyFinanceInfo", "loanapproval/firstApproval/queryFinanceInfo", "GetCompanyFinanceInfo", "data", true),
        //保存公司财务信息
        post("SaveCompanyFinanceInfo", "loanapproval/firstApproval/saveFinanceInfo", "SaveCompanyFinanceInfo", null, true, true),
        //计算汇总数据
        post("ComputeCollectBankInfo", "loanapproval/firstApproval/calculateFinanceBankflowSum", "ComputeCollectBankInfo", "data", true),
        //获取终审基本信息
        post("GetFinalBaseInfo", "loanapproval/final/queryBaseInfo", "GetFinalBaseInfo", "data", true),
        //保存终审基本信息
        post("SaveFinalBaseInfo", "loanapproval/final/saveBaseInfo", "SaveFinalBaseInfo", null, true, false),
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);

