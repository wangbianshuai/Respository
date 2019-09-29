const { GetProperty } =require( "./Common");

module.exports= {
    Name: "ApprovalOpinion",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties()
}

/*result (string): 审核结论 ,
basicInfo (string, optional): 基本情况 ,
coreProblem (string, optional): 核心问题 ,
suggest (string, optional): 建议措施
approvalResult (ConferenceApprovalResultDto): 审批结果 ,
department (string): 部门 ,
job (string): 职位 ,
name (string): 姓名*/
function GetProperties() {
    return [
        GetProperty("OpinionRemark", "approvalRemark", "备注"),
        GetProperty("ApproveStatus", "approvalResult", "状态"),
        GetProperty("AprrovalRemark", "approvalRemark", "备注"),
        GetProperty("ApproveStatus2", "resultName", ""),
        GetProperty("ApproveReuslt2", "result2", ""),
        GetProperty("BaseInfo", "basicInfo", "基本情况"),
        GetProperty("CoreProblem", "coreProblem", "核心问题"),
        GetProperty("Recommended", "suggest", "建议措施"),
        GetProperty("Name", "name", "姓名"),
        GetProperty("DeptName", "department", "部门"),
        GetProperty("JobName", "job", "职位"),
        GetProperty("ApprovalResult", "approvalResult")
    ]
}

