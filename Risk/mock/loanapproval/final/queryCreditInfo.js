export default {
    'POST /RiskControlApproval/loanapproval/final/queryCreditInfo': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "personalInfo": {
                "pmortgageDebtNoequal": 2340,
                "pmortgageDebtEqual": 3450,
                "pcreditDebtNoequal": 4540,
                "pavgUsedCreditAmtSixmon": 3450,
                "pcreditDebtEqual": 3450,
                "pavgRepayAmountSixmon": 35340,
                "ptotalUsedCreditAmount": 4340,
                "ptotalCreditAmount": 34340
              },
              "enterpriseInfo": {
                "emortgageDebtNoequal": 34530,
                "emortgageDebtEqual": 43430,
                "ecreditDebtNoequal": 34340,
                "ecreditDebtEqual": 3450
              },
              "otherInfo": {
                "extGuaranteeAmount": 353430,
                "extGuaranteeCount": 3430,
                "onemonQuireCount": 340,
                "twomonQuireCount": 34340
              }
        }
    }
}