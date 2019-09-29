export default {
    'POST /RiskControlApproval/useraccess/user/queryUserBaseInfo': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "userId": "UR151825247077662720",
            "employeeId": "180700095",
            "name": "张毅",
            "department": "测试部",
            "job": "测试工程师",
            "email": "zhangyi4@xinxindai.com",
            "phone": "15600000001",
            "updateTime": null,
            "createTime": "2019-06-25 01:18:00"
        }
    }
}