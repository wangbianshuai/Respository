export default {
    'POST /RiskControlApproval/loanapproval/back/queryBackOrSupplementMaterial': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "backWorkOrder": {
                "backId": "34525245",
                "applyId": "425245245",
                "requestTime": "2019-06-06 11:20:30",
                "requestUserRole": "张三",
                "approvalResult": "02",
                "approvalRemark": "测试你一且的"
            },
            "supplementMaterial": {
                "supplementId": "23434",
                "requestTime": "2019-06-06 11:20:30",
                "requestUserid": "3425534",
                "requestUserRole": "补件发起方角色",
                "approvalResult": "04",
                "approvalRemark": "补件发起方审核备注 ",
                "receiverUserid": "3423524545",
                "receiverUserRole": "补件接收方角色 ",
                "receiverCommitTime": "2019-06-06 11:20:30",
                "receiverCommitRemark": "补件备注 ",
                "remainingTime": 12231
            }
        }
    }
}