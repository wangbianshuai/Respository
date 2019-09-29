import DvaIndex from "DvaCommon";

const config = {
    Name: "OrderService",
    ServiceName: "ApiService",
    ActionList: [
        //工单-》工单池 查询工单
        post("QueryPoolOrder", "workOrder/pool/queryWorkOrder", "QueryPoolOrder", "data", true),
        //工单-》工单池 抢单
        post("GrabOrder", "workOrder/pool/grabWorkOrder", "GrabOrder", null, true, true),
        //工单-》工单池 派单
        post("DispatchOrder", "workOrder/pool/deliveryWorkOrder", "DispatchOrder", null, true, true),
        //工单-》工单池 查询派单角色用户
        post("GetRoleUser", "workOrder/workOrderQuery/queryQransformOrDeliveryUsers", "GetRoleUser", "data"),
        //获取工单详细信息
        post("GetOrderDetailEntityData", "loanapply/queryLoanapplyMaterial", "GetOrderDetailEntityData", "data", true),
        //保存工单详细信息
        post("SaveOrderDetailEntityData", "loanapply/saveLoanapplyMaterial", "SaveOrderDetailEntityData", null, true, true),
        //获取补件信息
        post("GetPatchInfo", "supplementMaterial/queryWaitSupplementMaterial", "PatchInfo", "data", true),
        //保存补件信息
        post("SavePatchInfo", "supplementMaterial/commitSupplementMaterial", "SavePatchInfo", null, true, true),
        //获取补件记录
        post("GetPatchRecordList", "supplementMaterial/querySupplementMaterial", "PatchRecordList", "data", true),
        //提交进件
        post("SubmitOrderInfo", "loanapply/commitLoanapplyMaterial", "SubmitOrderInfo", null, true, true),
        //获取审核工单详细信息
        post("GetApprovalOrderDetail", "loanapproval/firstApproval/queryBaseInfo", "GetApprovalOrderDetail", "data", true),
        //保存审核工单详细信息
        post("SaveApprovalOrderDetail", "loanapproval/firstApproval/saveBaseInfo", "SaveApprovalOrderDetail", null, true, true),
        //获取退单信息
        post("GetExitOrderInfo", "loanapproval/back/queryBackOrSupplementMaterial", "GetExitOrderInfo", "data", true),
        //查询待进件列表 
        post("QueryOrderDetailList", "loanapply/queryWaitCommitLoanApply", "QueryOrderDetailList", "data", true),
        //待审会处理订单
        post("CommitteeHandlerOrder", "loanapproval/final/conference/configConferenceRule", "CommitteeHandlerOrder", null, true, true),
        //挂起
        post("HandUpOrder", "workOrder/myWorkOrder/suspendWorkOrder", "HandUpOrder", null, true, true),
        //查询待处理工单列表 
        post("QueryWaitingOrderList", "workOrder/myWorkOrder/queryWaitProcessWorkOrder", "QueryWaitingOrderList", "data", true),
        //查询已处理工单列表 
        post("QueryHandledOrderList", "workOrder/myWorkOrder/queryProcessedWorkOrder", "QueryHandledOrderList", "data", true),
        //获取工单状态日志
        post("GetOrderStatusLogs", "workOrder/workOrderQuery/queryProcessLog", "GetOrderStatusLogs", "data", true),
         //获取我的工单状态日志
         post("GetMyOrderStatusLogs", "workOrder/myWorkOrder/queryProcessLog", "GetMyOrderStatusLogs", "data", true),
        //获取已挂起工单列表
        post("QuerySuspendedOrderList", "workOrder/myWorkOrder/querySuspendWorkOrder", "QuerySuspendedOrderList", "data", true),
        //解挂
        post("UnHandUpOrder", "workOrder/myWorkOrder/unSuspendWorkOrder", "UnHandUpOrder", null, true, true),
        //工单查询
        post("QueryOrderList", "workOrder/workOrderQuery/queryWorkOrder", "QueryOrderList", "data", true),
        //作废
        post("CancelOrder", "workOrder/workOrderQuery/discardWorkOrder", "CancelOrder", null, true, true),
        //转单
        post("ChangeUser", "workOrder/workOrderQuery/transformWorkOrder", "ChangeUser", null, true, true),
        //获取订单状态
        post("GetOrderStatus", "workOrder/workOrderQuery/queryWorkOrderState", "GetOrderStatus", "data", true),
        //获取查询退单或补件消息（二选一）
        post("GetPatchExitOrderInfo", "loanapproval/back/queryBackOrSupplementMaterial", "GetPatchExitOrderInfo", "data", true),
        //获取担保人信息
        post("GetCautionerInfo", "loanapproval/final/queryGuarantorLenderInfo", "GetCautionerInfo", "data", true),
        //保存担保人信息
        post("SaveCautionerInfo", "loanapproval/final/saveGuarantorLenderInfo", "SaveCautionerInfo", null, true, true),
        //获取共借人信息
        post("GetCoBorrowerInfo", "loanapproval/final/queryGuarantorLenderInfo", "GetCoBorrowerInfo", "data", true),
        //保存共借人信息
        post("SaveCoBorrowerInfo", "loanapproval/final/saveGuarantorLenderInfo", "SaveCoBorrowerInfo", null, true, true),
        //发标查询
        post("QueryBidOrderList", "bidIssue/queryBidIssue", "QueryBidOrderList", "data", true),
        //发标
        post("Bidding", "bidIssue/bidIssue", "Bidding", null, true, true),
        //客户进件记录
        post("QueryCustomerOrderList", "loancustomer/customer/query/workOrder", "QueryCustomerOrderList", "data", true),

    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);