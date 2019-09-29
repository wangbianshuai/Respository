export default {
    'POST /RiskControlApproval/useraccess/role/queryUsersByRole': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
          "userList": [
            {
              "userId": "UR151825247077662720",
              "employeeId": 4323545,
              "name": "张毅",
              "department": null,
              "job": null,
              "email": null,
              "phone": null,
              "updateTime": null,
              "createTime": null
            },
            {
                "userId": "4452452452",
                "employeeId": 425245,
                "name": "张毅",
                "department": null,
                "job": null,
                "email": null,
                "phone": null,
                "updateTime": null,
                "createTime": null
              },
              {
                "userId": "4524524545",
                "employeeId": 3425245,
                "name": "张毅",
                "department": null,
                "job": null,
                "email": null,
                "phone": null,
                "updateTime": null,
                "createTime": null
              }
          ],
          "pageResponse": null
        }
      }
}