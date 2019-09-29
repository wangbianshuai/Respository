import DvaIndex from "DvaCommon";

const config = {
    Name: "CreditService",
    ServiceName: "ApiService",
    ActionList: [
        //获取征信信息
        post("GetCreditInfo", "loanapproval/firstApproval/queryCreditInfo", "GetCreditInfo", "data", true),
        //保存征信信息
        post("SaveCreditInfo", "loanapproval/firstApproval/saveCreditInfo", "SaveCreditInfo", null, true, true),
        //获取终审征信信息
        post("GetFinalCreditInfo", "loanapproval/final/queryCreditInfo", "GetFinalCreditInfo", "data", true),
        //保存终审征信信息
        post("SaveFinalCreditInfo", "loanapproval/final/saveCreditInfo", "SaveFinalCreditInfo", null, true, true),
        //计算授信额度
        post("ComputeCreditQuota", "ComputeCreditQuota", "ComputeCreditQuota", "data"),
        //计算授信额度
        post("GetCreditQuota", "GetCreditQuota", "GetCreditQuota", "data"),
        //获取授信测算信息
        post("GetFinalCreditCalculate", "loanapproval/creditcalculation/queryFinalCreditCalculate", "GetFinalCreditCalculate", "data", true),
        //保存授信测算信息
        post("SaveFinalCreditCalculate", "loanapproval/creditcalculation/saveFinalCreditCalculate", "SaveFinalCreditCalculate", null, true, true),
        //获取终审授信结论信息
        post("GetFinalCreditApprovalResult", "loanapproval/final/queryCreditResult", "GetFinalCreditApprovalResult", "data", true),
        //保存终审授信结论信息
        post("SaveFinalCreditApprovalResult", "loanapproval/final/saveApproveCreditResult", "SaveFinalCreditApprovalResult", null, true, true),
        //网查复核查询
        post("GetNetCheckList", "loancustomer/netCheck/queryNetCheck", "GetNetCheckList", "data", true),
        //网查复核
        post("NetCheckReview", "loancustomer/netCheck/netCheck", "NetCheckReview", null, true, true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);