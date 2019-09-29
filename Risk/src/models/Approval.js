import DvaIndex from "DvaCommon";

const config = {
    Name: "ApprovalService",
    ServiceName: "ApiService",
    ActionList: [
        //获取终审授信结论
        post("GetFinalApprovalResult", "loanapproval/final/confirm/queryCreditResult", "GetFinalApprovalResult", "data", true),
        post("GetFinalReviewApprovalResult", "loanapproval/final/review/queryCreditResult", "GetFinalReviewApprovalResult", "data", true),
        //保存审核意见
        post("SaveApprovalOpinion", "loanapproval/final/confirm/commitApproval", "SaveApprovalOpinion", null, true, true),
        //获取审核意见
        post("GetApprovalOpinion", "loanapproval/final/confirm/queryApproval", "GetApprovalOpinion", "data", true),
        //获取初审审核意见
        post("GetFirstTrialApprovalOpinion", "loanapproval/firstApproval/queryApproval", "GetFirstTrialApprovalOpinion", "data", true),
        //初审保存审核意见
        post("SaveFirstTrialApprovalOpinion", "loanapproval/firstApproval/commitApproval", "SaveFirstTrialApprovalOpinion", null, true, true),
        //初审电核获取审核意见
        post("GetFirstTrialPhoneApprovalOpinion", "loanapproval/firstApproval/phoneCheck/queryApproval", "GetFirstTrialPhoneApprovalOpinion", "data", true),
        //初审电核保存审核意见
        post("SaveFirstTrialPhoneApprovalOpinion", "loanapproval/firstApproval/phoneCheck/commitApproval", "SaveFirstTrialPhoneApprovalOpinion", null, true, true),
        //实地审核获取审核意见
        post("GetIndeedApprovalOpinion", "loanapproval/place/query", "GetIndeedApprovalOpinion", "data", true),
        //实地审核保存审核意见
        post("SaveIndeedApprovalOpinion", "loanapproval/place/commitApproval", "SaveIndeedApprovalOpinion", null, true, true),
        //终审审核获取审核意见
        post("GetFinalApprovalOpinion", "loanapproval/final/queryApproval", "GetFinalApprovalOpinion", "data", true),
        //终审审核保存审核意见
        post("SaveFinalApprovalOpinion", "loanapproval/final/commitApproval", "SaveFinalApprovalOpinion", null, true, true),
        //终审复核获取审核意见
        post("GetFinalReviewApprovalOpinion", "loanapproval/final/review/queryApproval", "GetFinalReviewApprovalOpinion", "data", true),
        //终审复核保存审核意见
        post("SaveFinalReviewApprovalOpinion", "loanapproval/final/review/commitApproval", "SaveFinalReviewApprovalOpinion", null, true, true),
        //贷审会获取审核意见
        post("GetCommitteeApprovalOpinion", "loanapproval/final/conference/queryApproval", "GetCommitteeApprovalOpinion", "data", true),
        //贷审会保存审核意见
        post("SaveCommitteeApprovalOpinion", "loanapproval/final/conference/commitApproval", "SaveCommitteeApprovalOpinion", null, true, true),
        //获取贷审会意见明细
        post("GetApprovalOpinionDetails", "loanapproval/final/conference/queryApproval", "GetApprovalOpinionDetails", "data", true),
        //等待签约条件审核获取审核意见
        post("GetWaitConditionApprovalOpinion", "loanapproval/final/waitSign/queryApproval", "GetWaitConditionApprovalOpinion", "data", true),
        //等待签约条件审核保存审核意见
        post("SaveWaitConditionApprovalOpinion", "loanapproval/final/waitSign/commitApproval", "SaveWaitConditionApprovalOpinion", null, true, true),
        
    ]
}



function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);