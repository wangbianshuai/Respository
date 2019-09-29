export default {
    'POST /RiskControlApproval/loanapproval/firstApproval/queryFinanceInfo': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "financeFlowSum": {
                "publicMonAvgAmount": 1000,
                "privateMonAvgAmount": 2342,
                "totalMonAvgAmount": 234,
                "totalInterestAmount": 1232
            },
            "bankcardFlowList": [
                {
                    "bankcardId": "6228452005652844161",
                    "monthAverageAmount": 230,
                    "interestSumAmount": 23434,
                    "bankName": "中国农业银行",
                    "accountName": "马大哈",
                    "type": "01"
                },
                {
                    "bankcardId": "6228452005652844163",
                    "monthAverageAmount": 345,
                    "interestSumAmount": 3434,
                    "bankName": "中国农业银行",
                    "accountName": "马大哈",
                    "type": "02"
                }
            ]
        }
    }
}