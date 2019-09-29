const { GetProperty } =require( "./Common");

module.exports= {
    Name: "RefundOrder",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties()
}


function GetProperties() {
    return [
        GetProperty("CreateDate", "requestTime", "发起时间"),
        GetProperty("CreateUser", "requestUserRole", "发起方"),
        GetProperty("ApprovalOpinion", "approvalResult", "审核意见"),
        GetProperty("ApprovalOpinionName", "approvalResultName", "审核意见"),
        GetProperty("ApprovalRemark", "approvalRemark", "备注"),
        GetProperty("Title", "Title", "")
    ]
}