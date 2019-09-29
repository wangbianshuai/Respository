const { AssignProporties } =require( "../../Common");
const ReadBaseInfo =require( "../../views/Order/ReadBaseInfo");
const PatchRecord =require( "../../views/OrderPatch/PatchRecord");
const WaitConditionApprovalOpinion =require( "../../views/OrderApproval/WaitConditionApprovalOpinion");

//审核管理/等待签约条件审核 1900-1999
const DataActionTypes = {
    //获取订单基本信息实体数据
    GetOrderInfoEntityData: 1900,
    //获取补件信息
    GetPatchRecordEntityData: 1901,
    //获取审核意见
    GetApprovalOpinion: 1902,
    //保存审核意见
    SaveApprovalOpinion: 1903,
    //获取工单状态
    GetOrderStatus: 1904
}

module.exports= {
    Name: "WaitConditionAuditing",
    Type: "View",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"WaitConditionAuditing"}, [ReadBaseInfo(DataActionTypes), PatchRecord(DataActionTypes, true, true), WaitConditionApprovalOpinion(DataActionTypes)])
}

function GetEventActions() {
    return [
        //获取订单基本信息实体数据 GetOrderInfoEntityData: 1900,
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
        //获取补件信息 GetPatchRecordInfo: 1901,
        {
            Name: "GetPatchRecordEntityData",
            Type: "EntityEdit/GetEntityData",
            EditView: "PatchRecord",
            SetGetEntityDataLoad: "SetGetPatchExitOrderInfoLoad"
        },
        //获取审核意见 GetApprovalOpinion: 1902,
        {
            Name: "GetApprovalOpinion",
            Type: "EntityEdit/GetEntityData",
            EditView: "WaitConditionAuditingApprovalOpinion",
            EditPropertiyViewList: ["WaitConditionAuditingApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        //保存审核意见 SaveApprovalOpinion: 1903
        {
            Name: "SaveApprovalOpinion",
            Type: "EntityEdit/SaveEntityDataViews",
            ToPageUrl: "/Orders/HandledOrderList",
            EditPropertiyViewList: ["WaitConditionAuditingApprovalOpinion2", "ApprovalLeftRightButtonView"],
            SetDisabledViewList: ["WaitConditionAuditingApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        {
            Name: "ToAttachPage5",
            Type: "Page/ToAttachPage"
        }
    ]
}