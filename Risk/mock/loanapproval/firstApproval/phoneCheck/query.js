export default {
    'POST /RiskControlApproval/loanapproval/firstApproval/phoneCheck/query': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "checkContactType": "01",
            "phoneNumber": "1546463434",
            "firstCallTime": "2019-10-10 12:12:12",
            "secondCallTime": "2019-10-10 12:12:12",
            "thirdCallTime": "2019-10-10 12:12:12",
            "contactName": "张三",
            "relationship": "02",
            "questionlist": [
                {
                    "checkContactType": "01",
                    "questionDesc": "公司名称、地址",
                    "questionAnswer": "公司名称、地址"
                },
                {
                    "checkContactType": "01",
                    "questionDesc": "主要申请人在公司职务",
                    "questionAnswer": "主要申请人在公司职务"
                }
            ]
        }
    }
}