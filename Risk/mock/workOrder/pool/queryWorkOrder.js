export default {
    'POST /RiskControlApproval/workOrder/pool/queryWorkOrder': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "workOrderList": [
                {
                    "loanApplyId": "LA152004922739523584",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-27 11:52:49",
                    "workOrderState": "18"
                },
                {
                    "loanApplyId": "LA152001916262416384",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-27 11:14:34",
                    "workOrderState": "18"
                },
                {
                    "loanApplyId": "LA152004418080866304",
                    "taskList": [
                        {
                            "taskId": "50079",
                            "taskDefKey": "FirstApprovalUserTask",
                            "taskDefName": "初审审核",
                            "taskAssigneeId": null,
                            "taskAssigneeName": null
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
                    "updateTime": "2019-06-27 11:39:16",
                    "workOrderState": "03"
                },
                {
                    "loanApplyId": "LA152004195816308736",
                    "taskList": [
                        {
                            "taskId": "50073",
                            "taskDefKey": "FirstApprovalUserTask",
                            "taskDefName": "初审审核",
                            "taskAssigneeId": null,
                            "taskAssigneeName": null
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
                    "updateTime": "2019-06-27 11:36:04",
                    "workOrderState": "03"
                },
                {
                    "loanApplyId": "LA152005899844583424",
                    "taskList": [
                        {
                            "taskId": "50105",
                            "taskDefKey": "FirstApprovalUserTask",
                            "taskDefName": "初审审核",
                            "taskAssigneeId": null,
                            "taskAssigneeName": null
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
                    "updateTime": "2019-06-27 12:02:55",
                    "workOrderState": "03"
                },
                {
                    "loanApplyId": "LA152001345031766016",
                    "taskList": [
                        {
                            "taskId": "50016",
                            "taskDefKey": "FirstApprovalUserTask",
                            "taskDefName": "初审审核",
                            "taskAssigneeId": null,
                            "taskAssigneeName": null
                        }
                    ],
                    "lenderName": "测试猿",
                    "companyName": "马大哈有限责任公司",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-27 11:15:51",
                    "workOrderState": "03"
                },
                {
                    "loanApplyId": "LA152014868810039296",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-27 02:39:13",
                    "workOrderState": "18"
                },
                {
                    "loanApplyId": "LA151921316906139648",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "公司名",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA152016150857777152",
                    "taskList": [],
                    "lenderName": "严满郦",
                    "companyName": null,
                    "loanSellerId": "4233",
                    "loanSellerName": "test001",
                    "loanSellerDepartment": "产品部",
                    "productCategory": "01",
                    "productShortName": "新商贷",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": "2019-06-27 03:10:49",
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA151922040608129024",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "公司名",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA151923251788906496",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "公司名",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA151923777922400256",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "公司名",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
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
                    "loanApplyId": "LA151904333531709440",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "马大哈有限责任公司",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "授信贷",
                    "productShortName": "productShortName",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": "2019-06-26 09:48:31",
                    "workOrderState": "18"
                },
                {
                    "loanApplyId": "LA151904565459943424",
                    "taskList": [],
                    "lenderName": "测试",
                    "companyName": "马大哈有限责任公司",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": "2019-06-26 09:49:13",
                    "workOrderState": "18"
                },
                {
                    "loanApplyId": "LA151911312853565440",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "公司名",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA151912002195816448",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "公司名",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA151912117086191616",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "公司名",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA151901449461170176",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "string",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA151840762647019520",
                    "taskList": [],
                    "lenderName": "仲明1",
                    "companyName": "XXD",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": "2019-06-25 05:26:34",
                    "workOrderState": "01"
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
                    "loanApplyId": "LA151921316906139648",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "string",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA151829913559629824",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "string",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA151919693408501760",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "公司名",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
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
                    "loanApplyId": "LA151829189857640448",
                    "taskList": [],
                    "lenderName": "string",
                    "companyName": "string",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "loanSellerDepartment": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-06 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                }
            ],
            "pageResponse": {
                "total": 26,
                "curPageNum": 1,
                "curPageSize": 26
            }
        }
    }
}