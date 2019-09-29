export default {
    'POST /RiskControlApproval/loanproduct/repayWay/query': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "repayWayList": [{
                "repaymentConfigId": "343245",
                "name": "45245",
                "repaymentWay": "01",
                "periodWay": 3,
                "periodWayUnit": "03",
                "annualCalcWay": "01",
                "description": "3432434"
            },
            {
                "repaymentConfigId": "3423545",
                "name": "35245425",
                "repaymentWay": "02",
                "periodWay": 5,
                "periodWayUnit": "01",
                "annualCalcWay": "02",
                "description": "3432434"
            }],
            "pageResponse": {
                "total": 0,
                "curPageNum": 1,
                "curPageSize": 0
            }
        }
    }
}