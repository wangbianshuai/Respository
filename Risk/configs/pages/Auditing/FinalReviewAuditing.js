const { AssignProporties } =require( "../../Common");
const ReadBaseInfo =require( "../../views/Order/ReadBaseInfo");
const FinalApprovalResult =require( "../../views/OrderApproval/FinalApprovalResult");
const FinalReviewApprovalOpinion =require( "../../views/OrderApproval/FinalReviewApprovalOpinion");

//审核管理/终审复核 1400-1499
const DataActionTypes = {
    //获取订单基本信息实体数据
    GetOrderInfoEntityData: 1400,
    //获取终审授信结论信息
    GetFinalApprovalResult: 1401,
    //获取审核意见
    GetApprovalOpinion: 1402,
    //保存审核意见
    SaveApprovalOpinion: 1403,
    //获取工单状态
    GetOrderStatus: 1404
}

module.exports= {
    Name: "FinalReviewAuditing",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"FinalReviewAuditing"}, [ReadBaseInfo(DataActionTypes), FinalApprovalResult(DataActionTypes), FinalReviewApprovalOpinion(DataActionTypes)])
}

function GetEventActions() {
    return [
        //获取订单基本信息实体数据 GetOrderInfoEntityData: 1400,
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
        //获取终审授信结论信息 GetFinalApprovalResult: 1401,
        {
            Name: "GetFinalApprovalResult",
            Type: "EntityEdit/GetEntityData",
            EditView: "FinalApprovalResult",
            SetGetEntityDataLoad:"GetFinalCreditApprovalResultDataLoad"
            
        },
        //获取审核意见 GetApprovalOpinion: 1402,
        {
            Name: "GetApprovalOpinion",
            Type: "EntityEdit/GetEntityData",
            EditView: "FinalReviewApprovalOpinion",
            EditPropertiyViewList: ["FinalReviewApprovalOpinion2", "ApprovalOpinionRightButtonView"]
        },
        //保存审核意见 SaveApprovalOpinion: 1403
        {
            Name: "SaveApprovalOpinion",
            Type: "EntityEdit/SaveEntityDataViews",
            ToPageUrl: "/Orders/HandledOrderList",
            EditPropertiyViewList: ["FinalReviewApprovalOpinion2", "ApprovalOpinionRightButtonView"],
            SetDisabledViewList: ["FinalReviewApprovalOpinion2", "ApprovalOpinionRightButtonView"]
        }
    ]
}