const { GetProperty } =require( "./Common");

module.exports= {
    Name: "Credit",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

/*ecreditDebtEqual (number, optional),
ecreditDebtNoequal (number, optional),
emortgageDebtEqual (number, optional),
emortgageDebtNoequal (number, optional)*/
function GetProperties() {
    return [
        GetProperty("CompanyDebtBalanceNoEquals", "emortgageDebtNoequal", "企业抵押+质押贷款负债余额（非等额本息）"),
        GetProperty("CompanyDebtBalance", "emortgageDebtEqual", "企业抵押+质押贷款负债余额（等额本息）"),
        GetProperty("CompanyCreditBalanceNoEquals", "ecreditDebtNoequal", "企业信用贷款负债余额（非等额本息）"),
        GetProperty("CompanyCreditBalance", "ecreditDebtEqual", "企业信用贷款负债余额（等额本息）"),
        /*pavgRepayAmountSixmon (number, optional),
pavgUsedCreditAmtSixmon (number, optional),
pcreditDebtEqual (number, optional),
pcreditDebtNoequal (number, optional),
pmortgageDebtEqual (number, optional),
pmortgageDebtNoequal (number, optional),
ptotalCreditAmount (number, optional),
ptotalUsedCreditAmount (number, optional)*/
        GetProperty("PersonDebtBalanceNoEquals", "pmortgageDebtNoequal", "个人当前抵押+质押贷款负债余额（非等额本息）"),
        GetProperty("PersonDebtBalance", "pmortgageDebtEqual", "个人当前抵押+质押贷款负债余额（等额本息）"),
        GetProperty("PersonCreditBalanceNoEquals", "pcreditDebtNoequal", "个人信用贷款负债余额（非等额本息）"),
        GetProperty("PersonCreditBalance", "pcreditDebtEqual", "个人信用贷款负债余额（等额本息）"),
        GetProperty("PersonRepaymentAvgSixAmount", "pavgRepayAmountSixmon", "个人贷款平均还款金额（近6个月）"),
        GetProperty("PersonTotalCreditQuota", "ptotalCreditAmount", "个人贷记卡总授信额度"),
        GetProperty("PersonUsedCreditQuota", "ptotalUsedCreditAmount", "个人贷记卡已使用额度"),
        GetProperty("PersonUsedAvgSixCreditQuota", "pavgUsedCreditAmtSixmon", "个人贷记卡平均使用额度（近6个月）"),
        /*extGuaranteeAmount (number, optional): 企业+个人当前对外担保金额 ,
extGuaranteeCount (number, optional): 企业+个人当前对外担保笔数 ,
onemonQuireCount (number, optional): 征信查询次数（最近1个月内） ,
twomonQuireCount (number, optional): 征信查询次数（最近2个月内）*/
        GetProperty("ForeignGuaranteeAmount", "extGuaranteeAmount", "企业+个人当前对外担保金额"),
        GetProperty("ForeignGuaranteeCount", "extGuaranteeCount", "企业+个人当前对外担保笔数"),
        GetProperty("QueryCountOneMonth", "onemonQuireCount", "企业+查询次数（最近1个月内）"),
        GetProperty("QueryCountTwoMonth", "twomonQuireCount", "企业+查询次数（最近2个月内）")
    ]
}