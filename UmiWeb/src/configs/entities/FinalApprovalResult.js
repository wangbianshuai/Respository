import { GetProperty } from "./Common";

export default {
    Name: "FinalApprovalResult",
    PrimaryKey: "OrderCode",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("ApprovedLoanAmount", "ApprovedLoanAmount", "批复借款金额"),
        GetProperty("ApprovedLoanPeriod", "ApprovedLoanPeriod", "批复借款期限"),
        GetProperty("ApprovedLoanRate", "ApprovedLoanRate", "批复借款金额"),
        GetProperty("BackMethod", "BackMethod", "还款方式"),
        GetProperty("StagingMode", "StagingMode", "分期方式"),
        GetProperty("YearRateMode", "YearRateMode", "年化计算方式"),
        GetProperty("InfoManageRate", "InfoManageRate", "信息管理费率"),
        GetProperty("ManageCollectionType", "ManageCollectionType", "收取类型"),
        GetProperty("ManageCollectionMethod", "ManageCollectionMethod", "收取方式"),
        GetProperty("InfoServiceRate", "InfoServiceRate", "信息服务费率"),
        GetProperty("ServiceCollectionType", "ServiceCollectionType", "收取类型"),
        GetProperty("ServiceCollectionMethod", "ServiceCollectionMethod", "收取方式")
    ]
}