export default {
    'POST /RiskControlApproval/loanapproval/creditcalculation/queryFinalCreditCalculate': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "checkedPrivateFlow": 1200,
            "checkedPublicFlow": 1230,
            "calcLoanPeriod": 1420,
            "calcLoanPeriodUnit": "03",
            "calcType": "01"
        }
    }
}