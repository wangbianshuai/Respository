export default {
    'POST /RiskControlApproval/loanapproval/final/uploadBillInfo': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "monthAvgBillFierstyear": 123230,
            "monthAvgBillSecondyear": 2330
        }
    }
}