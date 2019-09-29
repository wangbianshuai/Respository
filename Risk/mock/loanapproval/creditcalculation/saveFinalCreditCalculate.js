export default {
    'POST /RiskControlApproval/loanapproval/creditcalculation/saveFinalCreditCalculate': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": { 
            "calcLoanAmount": 2344
        }
    }
}