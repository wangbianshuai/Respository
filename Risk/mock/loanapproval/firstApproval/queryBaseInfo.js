export default {
    'POST /RiskControlApproval/loanapproval/firstApproval/queryBaseInfo': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "approvalBaseList": [
                {
                    "type": "01",
                    "remark": "remark保存基本信息"
                },
                {
                    "type": "02",
                    "remark": "remark保存基本信息"
                },
                {
                    "type": "03",
                    "remark": "remark保存基本信息"
                }, {
                    "type": "04",
                    "remark": "remark保存基本信息"
                }
                , {
                    "type": "05",
                    "remark": "remark保存基本信息"
                }, {
                    "type": "06",
                    "remark": "remark保存基本信息"
                }
            ]
        }
    }
}