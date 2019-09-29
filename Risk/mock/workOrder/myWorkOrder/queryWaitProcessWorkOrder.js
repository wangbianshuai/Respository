export default {
    'POST /RiskControlApproval/workOrder/myWorkOrder/queryWaitProcessWorkOrder': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "workOrderList": [
                {
                    "loanApplyId": "LA152105616100294656",
                    "taskList": [
                        {
                            "taskId": "95029",
                            "taskDefKey": "SupplementLoanApplyUserTask",
                            "taskDefName": "补件",
                            "taskAssigneeId": "UR151825247077662720",
                            "taskAssigneeName": "张毅"
                        }
                    ],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-28 01:50:11",
                    "workOrderState": "12"
                },
                {
                    "loanApplyId": "LA152022091871289344",
                    "taskList": [
                        {
                            "taskId": "67520",
                            "taskDefKey": "FinalApprovalUserTask",
                            "taskDefName": "终审审核",
                            "taskAssigneeId": "UR151825247077662720",
                            "taskAssigneeName": "张毅"
                        }
                    ],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-27 04:23:19",
                    "workOrderState": "10"
                },
                {
                    "loanApplyId": "LA151904071538704384",
                    "taskList": [
                        {
                            "taskId": "42509",
                            "taskDefKey": "FirstPhoneApprovalUserTask",
                            "taskDefName": "初审电核",
                            "taskAssigneeId": "UR151825247077662720",
                            "taskAssigneeName": "张毅"
                        }
                    ],
                    "lenderName": "测试",
                    "companyName": "马大哈有限责任公司",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "授信贷",
                    "productShortName": "productShortName",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": "2019-06-27 11:24:59",
                    "workOrderState": "06"
                },
                {
                    "loanApplyId": "LA151840758352052224",
                    "taskList": [
                        {
                            "taskId": "42515",
                            "taskDefKey": "FirstPhoneApprovalUserTask",
                            "taskDefName": "初审电核",
                            "taskAssigneeId": "UR151825247077662720",
                            "taskAssigneeName": "张毅"
                        }
                    ],
                    "lenderName": "测试",
                    "companyName": "马大哈有限责任公司",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "授信贷",
                    "productShortName": "productShortName",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "06"
                },
                {
                    "loanApplyId": "LA151828185909035008",
                    "taskList": [
                        {
                            "taskId": "12510",
                            "taskDefKey": "FirstApprovalUserTask",
                            "taskDefName": "初审审核",
                            "taskAssigneeId": "UR151825247077662720",
                            "taskAssigneeName": "张毅"
                        }
                    ],
                    "lenderName": "string",
                    "companyName": "string",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "04"
                },
                {
                    "loanApplyId": "LA152016150857777152",
                    "taskList": [
                        {
                            "taskId": "92508",
                            "taskDefKey": "FirstPhoneApprovalUserTask",
                            "taskDefName": "初审电核",
                            "taskAssigneeId": "UR151825247077662720",
                            "taskAssigneeName": "张毅"
                        }
                    ],
                    "lenderName": "严满郦",
                    "companyName": "小名集团",
                    "loanSellerId": "4233",
                    "loanSellerName": "test001",
                    "loanSellerDepartment": "产品部",
                    "productCategory": "01",
                    "productShortName": "新商贷",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": "2019-06-28 02:17:01",
                    "workOrderState": "06"
                }
            ],
            "pageResponse": {
                "total": 6,
                "curPageNum": 1,
                "curPageSize": 10
            }
        }
    }
}