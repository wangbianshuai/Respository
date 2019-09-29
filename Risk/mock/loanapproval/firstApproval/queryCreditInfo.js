export default {
    'POST /RiskControlApproval/loanapproval/firstApproval/queryCreditInfo': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": { 
            "personalInfo": {
                "pmortgageDebtNoequal": 2340,
                "pmortgageDebtEqual": 2340,
                "pcreditDebtNoequal": 22450,
                "pavgUsedCreditAmtSixmon": 2320,
                "pcreditDebtEqual": 1230,
                "pavgRepayAmountSixmon": 7540,
                "ptotalUsedCreditAmount": 4530,
                "ptotalCreditAmount": 34530
              },
              "enterpriseInfo": {
                "emortgageDebtNoequal": 4340,
                "emortgageDebtEqual": 3450,
                "ecreditDebtNoequal": 4350,
                "ecreditDebtEqual": 3450
              },
              "otherInfo": {
                "extGuaranteeAmount": 34350,
                "extGuaranteeCount": 34530,
                "onemonQuireCount": 3450,
                "twomonQuireCount": 35550
              }
        }
    }
}