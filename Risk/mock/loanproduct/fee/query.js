export default {
    'POST /RiskControlApproval/loanproduct/fee/query': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "loanProductFeeList": [{
                "feeTemplateId": "34134134",
                "feeType": "01",
                "feeName": "4134134",
                "feeRate": 12,
                "description": "23234",
                "chargeStage": "01",
                "chargeWay": "02"
            },
            {
                "feeTemplateId": "342343",
                "feeType": "02",
                "feeName": "4134134",
                "feeRate": 15,
                "description": "3434",
                "chargeStage": "02",
                "chargeWay": "01"
            }
            ],
            "pageResponse": {
                "total": 0,
                "curPageNum": 0,
                "curPageSize": 0
            }
        }
    }
}