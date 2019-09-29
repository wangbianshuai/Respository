export default {
    'POST /RiskControlApproval/loanapproval/final/queryBaseInfo': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "billInfo": {
                "monthAvgBillFierstyear": 230,
                "monthAvgBillSecondyear": 2340
            },
            "debtInfo": {
                "notbankDebtAmount": 2340,
                "expCreditLoanAmount": 2340,
                "bankLoanReduceAmount": 2320,
                "implicitLoanCount": 23230,
                "implicitLoanMonRepayAmount": 2320
            },
            "businessInfo": {
                "downBillPeriod": 2320,
                "curAccountsRecv": 2320,
                "curInventoryValue": 23230,
                "curAccountsPay": 23230,
                "curAccountsOtherPay": 2320,
                "enterpriseNetProfitRate": 23230
            },
            "assetsInfo": {
                "hasLocalRealEstate": "01",
                "hasMortgage": "01",
                "clearRealEstateValue": 320,
                "mortgageMonthAmount": 2330
            }
        }
    }
}