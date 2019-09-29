export default {
    'POST /RiskControlApproval/loanapproval/firstApproval/uploadBankflowAndCalc': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "bankcardId": "string",
            "monthAverageAmount": 1000,
            "interestSumAmount": 10000,
            "bankName": "string",
            "accountName": "string",
            "type": "string"
        }
    }
}