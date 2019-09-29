export default {
    'POST /RiskControlApproval/loanapproval/final/queryApproval': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "approvalResult": "01",
            "approvalRemark": "审核备注 string"
        }
    }
}