export default {
    'POST /RiskControlApproval/loanapproval/final/conference/queryApproval': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "result": "01",
            "conferenceRuleType": "15",
            "approvalResultList": [
                {
                    "name": "张毅",
                    "department": "测试部",
                    "job": "测试工程师",
                    "approvalUserId": "UR151825247077662720",
                    "approvalResult": {
                        "result": "01",
                        "basicInfo": "string",
                        "coreProblem": "string",
                        "suggest": "string"
                    }
                }
            ]
        }
    }
}