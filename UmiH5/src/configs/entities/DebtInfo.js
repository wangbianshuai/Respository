import { GetProperty } from "./Common";

export default {
    Name: "DebtInfo",
    PrimaryKey: "OrderCode",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("DebtTotalBalance", "DebtTotalBalance", "非银行机构负债总余额"),
        GetProperty("LoanTotalAmountThreeMonth", "LoanTotalAmountThreeMonth", "到期信用类贷款总额（近3个月）"),
        GetProperty("BankLoanReduceAmountThreeMonth", "BankLoanReduceAmountThreeMonth", "银行贷款减少总额（近3个月）"),
        GetProperty("DebtCount", "DebtCount", "隐性负债笔数"),
        GetProperty("DebtRepaymentMonthAmount", "DebtRepaymentMonthAmount", "隐性负债月还款额")
    ]
}