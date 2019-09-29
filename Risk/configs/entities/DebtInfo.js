const { GetProperty } =require( "./Common");

module.exports= {
    Name: "DebtInfo",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties()
}

/*notbankDebtAmount (number, optional): 非银行机构负债总余额 ,
expCreditLoanAmount (number, optional): 到期信用类贷款总额 ,
bankLoanReduceAmount (number, optional): 银行贷款减少总额 ,
implicitLoanCount (number, optional): 隐性负债笔数 ,
implicitLoanMonRepayAmount (number, optional): 隐性负债月还款额*/
function GetProperties() {
    return [
        GetProperty("DebtTotalBalance", "notbankDebtAmount", "非银行机构负债总余额"),
        GetProperty("LoanTotalAmountThreeMonth", "expCreditLoanAmount", "到期信用类贷款总额（近3个月）"),
        GetProperty("BankLoanReduceAmountThreeMonth", "bankLoanReduceAmount", "银行贷款减少总额（近3个月）"),
        GetProperty("DebtCount", "implicitLoanCount", "隐性负债笔数"),
        GetProperty("DebtRepaymentMonthAmount", "implicitLoanMonRepayAmount", "隐性负债月还款额")
    ]
}