export default {
    'POST /RiskControlApproval/supplementMaterial/querySupplementMaterial': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "materialList": [
                {
                    "supplementId": "34314",
                    "requestTime": "2019-06-06 11:20:30",
                    "requestUserid": "34134",
                    "requestUserRole": "补件发起方角色 ",
                    "approvalResult": "03",
                    "approvalRemark": "补件发起方审核备注 ",
                    "receiverUserid": "3434",
                    "receiverUserRole": "补件接收方角色",
                    "receiverCommitTime": "2019-06-06 11:20:30",
                    "receiverCommitRemark": "补件备注 343434",
                    "remainingTime": 0
                },
                {
                    "supplementId": "34343434",
                    "requestTime": "2019-06-06 11:20:30",
                    "requestUserid": "34134",
                    "requestUserRole": "补件发起方角色2323 ",
                    "approvalResult": "05",
                    "approvalRemark": "补件发起方审核备注2323 ",
                    "receiverUserid": "3434",
                    "receiverUserRole": "补件接收方角色",
                    "receiverCommitTime": "2019-06-06 11:20:30",
                    "receiverCommitRemark": "补件备注 343434",
                    "remainingTime": 0
                }
            ]
        }
    }
}