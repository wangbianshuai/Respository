export default {
    'POST /RiskControlApproval/workOrder/workOrderQuery/queryQransformOrDeliveryUsers': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "string",
        "data": {
          "pageResponse": {
            "total": 0,
            "curPageNum": 0,
            "curPageSize": 0
          },
          "userList": [
            {
              "userId": "123434",
              "employeeId": "34134134",
              "name": "string341",
              "department": "string314",
              "job": "string314",
              "email": "string14",
              "phone": "string13413",
              "updateTime": "2019-06-06 11:20:30",
              "createTime": "2019-06-06 11:20:30"
            },
            {
                "userId": "3425",
                "employeeId": "425245",
                "name": "4525424524",
                "department": "string314",
                "job": "string314",
                "email": "string14",
                "phone": "string13413",
                "updateTime": "2019-06-06 11:20:30",
                "createTime": "2019-06-06 11:20:30"
              },
              {
                "userId": "4525445",
                "employeeId": "4524524",
                "name": "45245245",
                "department": "string314",
                "job": "string314",
                "email": "string14",
                "phone": "string13413",
                "updateTime": "2019-06-06 11:20:30",
                "createTime": "2019-06-06 11:20:30"
              }
          ]
        }
      }
}