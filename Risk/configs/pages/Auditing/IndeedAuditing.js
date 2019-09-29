const { AssignProporties } =require( "../../Common");
const ReadBaseInfo =require( "../../views/Order/ReadBaseInfo");
const ReadRefundOrder =require( "../../views/Order/ReadRefundOrder");
const IndeedApproval =require( "../../views/OrderApproval/IndeedApproval");

//审核管理/实地审核 1700-1799
const DataActionTypes = {
    //获取订单基本信息实体数据
    GetOrderInfoEntityData: 1700,
    //获取退单信息
    GetExitOrderInfo: 1701,
    //获取审核意见
    GetApprovalOpinion: 1702,
    //保存审核意见
    SaveApprovalOpinion: 1703,
    //获取工单状态
    GetOrderStatus: 1704
}

module.exports= {
    Name: "IndeedAuditing",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"IndeedAuditing"}, [ReadBaseInfo(DataActionTypes), ReadRefundOrder(DataActionTypes, true), IndeedApproval(DataActionTypes)])
}

function GetEventActions() {
    return [
        //获取订单基本信息实体数据 GetOrderInfoEntityData: 1700,
        {
            Name: "GetOrderInfoEntityData",
            Type: "EntityEdit/GetEntityData",
            EditView: "OrderInfo"
        },
        {
            Name: "ToOrderDetail",
            Type: "Page/OpenUrl",
            PageUrl: "/risk/CreditManage/OrderDetail?OrderCode=#{OrderCode}&LookCode=ee1645b3-f024-37c8-b08a-c734b4657aaa"
        },
        {
            Name: "SearchCustomer",
            Type: "Page/ToQueryCustomer"
        },
        //获取退单信息 GetExitOrderInfo: 1701,
        {
            Name: "GetExitOrderInfo",
            Type: "EntityEdit/GetEntityData",
            EditView: "ReadRefundOrder"
        },
        //获取审核意见 GetApprovalOpinion: 1702,
        {
            Name: "GetApprovalOpinion",
            Type: "EntityEdit/GetEntityData",
            EditView: "IndeedApprovalOpinion",
            EditPropertiyViewList: ["IndeedApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        //保存审核意见 SaveApprovalOpinion: 1703
        {
            Name: "SaveApprovalOpinion",
            Type: "EntityEdit/SaveEntityDataViews",
            ToPageUrl: "/Orders/HandledOrderList",
            EditPropertiyViewList: ["IndeedApprovalOpinion2", "ApprovalLeftRightButtonView"],
            SetDisabledViewList: ["IndeedApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        {
            Name: "ToAttachPage3",
            Type: "Page/ToAttachPage",
            DirType: 4 //4：实地审核附件
        }
    ]
}