import DvaIndex from "DvaCommon";

const config = {
    Name: "ApprovalService",
    ServiceName: "ApiService",
    ActionList: [
        //获取终审授信结论
        post("GetFinalApprovalResult", "GetFinalApprovalResult", "GetFinalApprovalResult", "data", true),
        //保存审核意见
        post("SaveApprovalOpinion", "SaveApprovalOpinion", "SaveApprovalOpinion", "data", true),
        //获取审核意见
        post("GetApprovalOpinion", "GetApprovalOpinion", "GetApprovalOpinion", "data", true),
        //获取初审审核意见
        post("GetFirstTrialApprovalOpinion", "GetApprovalOpinion", "GetFirstTrialApprovalOpinion", "data", true),
        //初审保存审核意见
        post("SaveFirstTrialApprovalOpinion", "SaveApprovalOpinion", "SaveFirstTrialApprovalOpinion", "data", true),
        //初审电核获取审核意见
        post("GetFirstTrialPhoneApprovalOpinion", "GetApprovalOpinion", "GetFirstTrialPhoneApprovalOpinion", "data", true),
        //初审电核保存审核意见
        post("SaveFirstTrialPhoneApprovalOpinion", "SaveApprovalOpinion", "SaveFirstTrialPhoneApprovalOpinion", "data", true),
         //实地审核获取审核意见
         post("GetIndeedApprovalOpinion", "GetApprovalOpinion", "GetIndeedApprovalOpinion", "data", true),
         //实地审核保存审核意见
         post("SaveIndeedApprovalOpinion", "SaveApprovalOpinion", "SaveIndeedApprovalOpinion", "data", true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);