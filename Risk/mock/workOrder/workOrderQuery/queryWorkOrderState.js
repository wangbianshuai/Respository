export default {
    'POST /RiskControlApproval/workOrder/workOrderQuery/queryWorkOrderState': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "loanApplyId": null,
            "taskList": null,
            "lenderName": null,
            "companyName": null,
            "loanSellerId": null,
            "loanSellerName": null,
            "loanSellerDepartment": null,
            "productCategory": null,
            "productShortName": null,
            "loanApplyTime": null,
            "updateTime": null,
            "workOrderState": "01"
        }
    }
}