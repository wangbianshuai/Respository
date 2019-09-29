export default {
    'POST /RiskControlApproval/loanapproval/place/query': GetResponse(),
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