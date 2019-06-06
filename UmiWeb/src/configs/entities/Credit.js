import { GetProperty } from "./Common";

export default {
    Name: "Credit",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("CompanyDebtBalanceNoEquals", "CompanyDebtBalanceNoEquals", "企业抵押+质押贷款负债余额（非等额本息）"),
        GetProperty("CompanyDebtBalance", "CompanyDebtBalance", "企业抵押+质押贷款负债余额（等额本息）"),
        GetProperty("CompanyCreditBalanceNoEquals", "CompanyCreditBalanceNoEquals", "企业信用贷款负债余额（非等额本息）"),
        GetProperty("CompanyCreditBalance", "CompanyCreditBalance", "企业信用贷款负债余额（等额本息）"),
        GetProperty("PersonDebtBalanceNoEquals", "PersonDebtBalanceNoEquals", "个人当前抵押+质押贷款负债余额（非等额本息）"),
        GetProperty("PersonDebtBalance", "PersonDebtBalance", "个人当前抵押+质押贷款负债余额（等额本息）"),
        GetProperty("PersonCreditBalanceNoEquals", "PersonCreditBalanceNoEquals", "个人信用贷款负债余额（非等额本息）"),
        GetProperty("PersonCreditBalance", "PersonCreditBalance", "个人信用贷款负债余额（等额本息）"),
        GetProperty("PersonRepaymentAvgSixAmount", "PersonRepaymentAvgSixAmount", "个人贷款平均还款金额（近6个月）"),
        GetProperty("PersonTotalCreditQuota", "PersonTotalCreditQuota", "个人贷记卡总授信额度"),
        GetProperty("PersonUsedCreditQuota", "PersonUsedCreditQuota", "个人贷记卡已使用额度"),
        GetProperty("PersonUsedAvgSixCreditQuota", "PersonUsedAvgSixCreditQuota", "个人贷记卡平均使用额度（近6个月）"),
        GetProperty("ForeignGuaranteeAmount", "ForeignGuaranteeAmount", "企业+个人当前对外担保金额"),
        GetProperty("ForeignGuaranteeAmount", "ForeignGuaranteeCount", "企业+个人当前对外担保笔数"),
        GetProperty("QueryCountOneMonth", "QueryCountOneMonth", "企业+查询次数（最近1个月内）"),
        GetProperty("QueryCountTwoMonth", "QueryCountTwoMonth", "企业+查询次数（最近2个月内）")
    ]
}