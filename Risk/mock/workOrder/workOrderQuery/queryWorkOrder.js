export default {
    'POST /RiskControlApproval/workOrder/workOrderQuery/queryWorkOrder': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "workOrderList": [
                {
                    "loanApplyId": "LA152105664418676736",
                    "taskList": [],
                    "lenderName": "法人借款人零陵",
                    "companyName": "法人借款人零陵",
                    "loanSellerId": "170200015",
                    "loanSellerName": "nullTEST",
                    "loanSellerDepartment": "nullTEST",
                    "productCategory": "01",
                    "productShortName": "ME",
                    "loanApplyTime": "2019-06-28 01:50:39",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA152105616100294656",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-28 01:50:11",
                    "workOrderState": "16"
                },
                {
                    "loanApplyId": "LA152104400624549888",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-28 01:31:15",
                    "workOrderState": "16"
                },
                {
                    "loanApplyId": "LA152104065617100800",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-28 01:26:20",
                    "workOrderState": "16"
                },
                {
                    "loanApplyId": "LA152104016224976896",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                },
                {
                    "loanApplyId": "LA152097565184098304",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-28 11:45:26",
                    "workOrderState": "18"
                },
                {
                    "loanApplyId": "LA152094815331287040",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": "2019-06-28 11:02:30",
                    "workOrderState": "18"
                },
                {
                    "loanApplyId": "LA152025572942282752",
                    "taskList": [
                        {
                            "taskId": "75008",
                            "taskDefKey": "RealPlaceUserTask",
                            "taskDefName": "实地",
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
                    "updateTime": "2019-06-27 05:07:44",
                    "workOrderState": "07"
                },
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
                    "loanApplyId": "LA152115043553509376",
                    "taskList": [],
                    "lenderName": "测试猿",
                    "companyName": "借款企业1",
                    "loanSellerId": "180700095",
                    "loanSellerName": "张毅",
                    "loanSellerDepartment": "测试部",
                    "productCategory": "01",
                    "productShortName": "新测试",
                    "loanApplyTime": "2019-06-27 11:20:30",
                    "updateTime": null,
                    "workOrderState": "01"
                }
            ],
            "pageResponse": {
                "total": 41,
                "curPageNum": 1,
                "curPageSize": 10
            }
        }
    }
}