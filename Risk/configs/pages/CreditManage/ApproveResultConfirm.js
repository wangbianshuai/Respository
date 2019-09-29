const { AssignProporties } =require( "../../Common");
const ReadBaseInfo =require( "../../views/Order/ReadBaseInfo");
const FinalApprovalResult =require( "../../views/OrderApproval/FinalApprovalResult");
const ApprovalOpinion =require( "../../views/OrderApproval/ApprovalOpinion");

//信贷管理/审批结论确认 1100-1199
const DataActionTypes = {
    //获取实体数据
    GetOrderInfoEntityData: 1100,
    //获取终审授信结论
    GetFinalApprovalResult: 1101,
    //保存审核意见
    SaveApprovalOpinion: 1102,
    //获取工单状态
    GetOrderStatus: 1103,
    //获取审核意见
    GetApprovalOpinion: 1104
}

module.exports= {
    Name: "ApproveResultConfirm",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"ApproveResultConfirm"}, [ReadBaseInfo(DataActionTypes), FinalApprovalResult(DataActionTypes), ApprovalOpinion(DataActionTypes)])
}

function GetEventActions() {
    return [{
        Name: "GetOrderInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "OrderInfo"
    },
    //获取审批意见 GetApprovalOpinion,
    {
        Name: "GetApprovalOpinion",
        Type: "EntityEdit/GetEntityData",
        EditView: "ApprovalOpinion",
        EditPropertiyViewList: ["ApprovalOpinion2", "ApprovalOpinionRightButtonView"]
    },
    {
        Name: "SaveApprovalOpinion",
        Type: "EntityEdit/SaveEntityDataViews",
        ToPageUrl: "/Orders/HandledOrderList",
        EditPropertiyViewList: ["ApprovalOpinion2", "ApprovalOpinionRightButtonView"],
        SetDisabledViewList: ["ApprovalOpinion2", "ApprovalOpinionRightButtonView"]
    },
    {
        Name: "ToAttachPage2",
        Type: "Page/ToAttachPage",
        DirType: 3 // 3：重审补单
    },
    {
        Name: "GetFinalApprovalResult",
        Type: "EntityEdit/GetEntityData",
        EditView: "FinalApprovalResult",
        SetGetEntityDataLoad:"GetFinalCreditApprovalResultDataLoad"
    },
    {
        Name: "ToOrderDetail",
        Type: "Page/OpenUrl",
        PageUrl: "/risk/CreditManage/OrderDetail?OrderCode=#{OrderCode}&LookCode=ee1645b3-f024-37c8-b08a-c734b4657aaa"
    },
    {
        Name: "SearchCustomer",
        Type: "Page/ToQueryCustomer"
    }]
}