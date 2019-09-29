export default {
    'POST /RiskControlApproval/loanapproval/firstApproval/phoneCheck/queryApproval': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "approvalRemark": "string",
            "approvalResult": "02"
        }
    }
}