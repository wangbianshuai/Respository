const { GetProperty } =require( "./Common");

module.exports= {
    Name: "Order",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties(),
    StatusDataSource: GetStatusDataSource(),
    QueryNameDataSource: GetQueryNameDataSource(),
    QueryNameDataSource2: GetQueryNameDataSource2(),
    BackMethodDataSource: GetBackMethodDataSource(),
    BorrowerUseDataSource: GetBorrowerUseDataSource(),
    BorrowerPeriodDataSource: GetBorrowerPeriodDataSource(),
    BidQueryNameDataSource: GetBidQueryNameDataSource(),
    BidStatusDataSource: GetBidStatusDataSource(),
    CustomerQueryNameDataSource: GetCustomerQueryNameDataSource()
}

function GetBorrowerPeriodDataSource() {
    return [{ Value: 12, Text: "12个月" }, { Value: 6, Text: "6个月" }]
}

function GetBackMethodDataSource() {
    return [{ Value: 1, Text: "等额本息" }, { Value: 2, Text: "先本后息" }]
}

function GetBorrowerUseDataSource() {
    return [{ Value: 1, Text: "短期资金周转" }, { Value: 2, Text: "长期资金周转" }]
}

function GetProperties() {
    return [
        GetProperty("OrderCode", "loanApplyId", "工单编号"),
        GetProperty("Borrowers", "companyName", "企业名称"),
        GetProperty("EnterpriseName", "enterpriseName", "企业名称"),
        GetProperty("BorrowerUser", "lenderName", "借款人"),
        GetProperty("ProductType", "productType", "产品"),
        GetProperty("LoanUser", "loanUser", "信贷员"),
        GetProperty("BorrowerDate", "loanApplyTime", "借款申请时间"),
        GetProperty("UpdateDate", "updateTime", "更新时间"),
        GetProperty("OrderStatus", "orderStatus", "状态"),
        GetProperty("StatusName", "statusName", "状态"),
        GetProperty("BidDate", "bidIssueTime", "发标请求时间"),
        GetProperty("BidStatus", "bidIssueResultName", "结果"),
    ]
}

/*
工单状态	
	03	待初审
	07	待实地
	09	待终审
	*/
function GetStatusDataSource() {
    return [{ Value: "03", Text: "待初审" }, { Value: "07", Text: "待实地" }, { Value: "09", Text: "待终审" }]
}

function GetBidStatusDataSource() {
    return [{ Value: "00", Text: "全部" }, { Value: "01", Text: "成功" }, { Value: "02", Text: "失败" }]
}

function GetQueryNameDataSource() {
    return [{ Value: "loanApplyId", Text: "工单编号" }, { Value: "companyName", Text: "企业名称" }, { Value: "lenderName", Text: "借款人" }]
}

function GetQueryNameDataSource2() {
    return [{ Value: "loanApplyId", Text: "工单编号" }, { Value: "enterpriseName", Text: "企业名称" }, { Value: "lenderName", Text: "借款人" }]
}


function GetBidQueryNameDataSource() {
    return [{ Value: "loanApplyId", Text: "工单编号" }, { Value: "companyName", Text: "企业名称" }, { Value: "lenderName", Text: "借款人" }]
}

function GetCustomerQueryNameDataSource() {
    return [{ Value: "companyName", Text: "企业名称" }, { Value: "loanMainPart", Text: "借款人" }]
}