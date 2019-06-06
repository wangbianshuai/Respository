import { GetProperty } from "./Common";

export default {
    Name: "Order",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties(),
    StatusDataSource: GetStatusDataSource(),
    QueryNameDataSource: GetQueryNameDataSource(),
    BackMethodDataSource: GetBackMethodDataSource(),
    BorrowerUseDataSource: GetBorrowerUseDataSource(),
    BorrowerPeriodDataSource: GetBorrowerPeriodDataSource(),
    OrderAreaDataSource: GetOrderAreaDataSource()
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
        GetProperty("Borrowers", "mainLender", "企业名称"),
        GetProperty("BorrowerUser", "lenderName", "借款人"),
        GetProperty("ProductType", "productType", "产品"),
        GetProperty("LoanUser", "loanSellerId", "信贷员"),
        GetProperty("BorrowerDate", "loanApplyTime", "借款申请时间"),
        GetProperty("UpdateDate", "updateTime", "更新时间"),
        GetProperty("OrderStatus", "workOrderState", "状态"),
        GetProperty("UserType", "UserType", "用户类型"),
        GetProperty("BorrowerAmount", "BorrowerAmount", "借款申请金额"),
        GetProperty("BorrowerPeriod", "BorrowerPeriod", "借款申请期限"),
        GetProperty("BackMethod", "BackMethod", "还款方式"),
        GetProperty("BorrowerUse", "BorrowerUse", "借款用途"),
        GetProperty("BorrowChannel", "BorrowChannel", "借款申请渠道"),
        GetProperty("OrderArea", "OrderArea", "进件地区")
    ]
}

function GetStatusDataSource() {
    return [{ Value: "0", Text: "待初审" }, { Value: "1", Text: "待实地" }, { Value: "2", Text: "待终审" }]
}

function GetQueryNameDataSource() {
    return [{ Value: "loanApplyId", Text: "工单编号" }, { Value: "lenderName", Text: "企业名称" }, { Value: "mainLender", Text: "借款人" }]
}

function GetOrderAreaDataSource() {
    return {
        ValueName: "Code",
        TextName: "Name",
        StateName: "GetCityList",
        ServiceName: "ApiService",
        ActionName: "GetCityList",
        ParentValueName: "ParentCode",
        Payload: {}
    }
}