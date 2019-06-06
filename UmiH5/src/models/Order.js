import DvaIndex from "DvaCommon";

const config = {
    Name: "OrderService",
    ServiceName: "ApiService",
    ActionList: [
        //工单-》工单池 查询工单
        post("QueryPoolOrder", "workOrder/pool/queryWorkOrder", "QueryPoolOrder", "data"),
        //工单-》工单池 抢单
        post("GrabOrder", "workOrder/pool/grabWorkOrder", "GrabOrder", "data"),
        //工单-》工单池 派单
        post("DispatchOrder", "workOrder/pool/deliveryWorkOrder", "DispatchOrder", "data"),
        //工单-》工单池 查询派单角色用户
        post("GetRoleUser", "workOrder/pool/GetRoleUser", "GetRoleUser", "data"),
        //获取工单详细信息
        post("GetOrderDetailEntityData", "getorderdetail", "GetOrderDetailEntityData", "data"),
        //保存工单详细信息
        post("SaveOrderDetailEntityData", "saveorderdetail", "SaveOrderDetailEntityData", "data"),
        //获取补件信息
        post("GetPatchInfo", "getpatchinfo", "PatchInfo", "data"),
        //保存补件信息
        post("SavePatchInfo", "savepatchinfo", "SavePatchInfo", "data"),
        //获取补件记录
        post("GetPatchRecordList", "getpatchrecords", "PatchRecordList", "data"),
        //提交进件
        post("SubmitOrderInfo", "SubmitOrderInfo", "SubmitOrderInfo", "data"),
        //保存审核工单详细信息
        post("SaveApprovalOrderDetail", "SaveApprovalOrderDetail", "SaveApprovalOrderDetail", "data"),
        //获取退单信息
        post("GetExitOrderInfo", "GetExitOrderInfo", "GetExitOrderInfo", "data"),
        //查询待进件列表 
        post("QueryOrderDetailList", "workOrder/pool/queryWorkOrder", "QueryOrderDetailList", "data", true),
        //待审会处理订单
        post("CommitteeHandlerOrder", "CommitteeHandlerOrder", "CommitteeHandlerOrder", "data", true, true),
        //挂起
        post("HandUpOrder", "HandUpOrder", "HandUpOrder", "data", true, true),
        //查询待处理工单列表 
        post("QueryWaitingOrderList", "workOrder/pool/queryWorkOrder", "QueryWaitingOrderList", "data", true),
        //查询已处理工单列表 
        post("QueryHandledOrderList", "workOrder/pool/queryWorkOrder", "QueryHandledOrderList", "data", true),
        //获取工单状态日志
        post("GetOrderStatusLogs", "getorderstatuslogs", "GetOrderStatusLogs", "data", true),
        //获取已挂起工单列表
        post("QuerySuspendedOrderList", "workOrder/pool/queryWorkOrder", "QuerySuspendedOrderList", "data", true),
        //解挂
        post("UnHandUpOrder", "UnHandUpOrder", "UnHandUpOrder", "data", true, true),
        //工单查询
        post("QueryOrderList", "workOrder/pool/queryWorkOrder", "QueryOrderList", "data", true),
        //作废
        post("CancelOrder", "CancelOrder", "CancelOrder", "data", true, true),
        //转单
        post("ChangeUser", "ChangeUser", "ChangeUser", "data", true, true),
        //获取订单状态
        post("GetOrderStatus", "GetOrderStatus", "GetOrderStatus", "data", true),
        //获取订单状态
        post("GetPatchExitOrderInfo", "GetPatchExitOrderInfo", "GetPatchExitOrderInfo", "data", true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);