export default {
    'POST /RiskControlApproval/loanapproval/firstApproval/calculateFinanceBankflowSum': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "publicMonAvgAmount": 1200,
            "privateMonAvgAmount": 4342,
            "totalMonAvgAmount": 2345,
            "totalInterestAmount": 1432
        }
    }
}