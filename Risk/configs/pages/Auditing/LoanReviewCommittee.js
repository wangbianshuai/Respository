const { AssignProporties } =require( "../../Common");
const ReadBaseInfo =require( "../../views/Order/ReadBaseInfo");
const LoanReviewApprovalOpinion =require( "../../views/OrderApproval/LoanReviewApprovalOpinion");
const LoanReviewOpinionRecord =require( "../../views/OrderApproval/LoanReviewOpinionRecord");

//审核管理/贷审会 1800-1899
const DataActionTypes = {
    //获取订单基本信息实体数据
    GetOrderInfoEntityData: 1800,
    //获取审核意见明细
    GetApprovalOpinionDetails: 1801,
    //获取审核意见
    GetApprovalOpinion: 1802,
    //保存审核意见
    SaveApprovalOpinion: 1803,
    //获取工单状态
    GetOrderStatus: 1804
}

module.exports= {
    Name: "LoanReviewCommittee",
    Type: "View",
    EventActions: GetEventActions(),
    Properties1: AssignProporties({Name:"LoanReviewCommittee"}, [ReadBaseInfo(DataActionTypes), LoanReviewApprovalOpinion(DataActionTypes)]),
    Properties2: AssignProporties({Name:"LoanReviewCommittee"}, [ReadBaseInfo(DataActionTypes), GetApprovalOpinionView(), LoanReviewOpinionRecord(DataActionTypes)])
}

function GetApprovalOpinionView() {
    return {
        Name: "FirstTrialApprovalOpinion2",
        Type: "View",
        ClassName: "DivView2",
        Title: "审核意见",
        Style: { marginTop: 8 },
        Properties: AssignProporties({Name:"LoanReviewCommittee"}, [GetOpinionSpanText()])
    }
}

function GetOpinionSpanText() {
    return {
        Name: "OpinionText",
        Type: "SpanText",
        Style: { color: "#0099FF" }
    }
}

function GetEventActions() {
    return [
        //获取订单基本信息实体数据 GetOrderInfoEntityData: 1800,
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
        //获取审核意见明细 GetApprovalOpinionDetails: 1801,
        {
            Name: "GetApprovalOpinionDetails",
            Type: "EntityEdit/GetEntityData",
            EditView: "LoanReviewOpinionRecord",
            SetGetEntityDataLoad: "SetGetApprovalOpinionDetails"
        },
        //获取审核意见 GetApprovalOpinion: 1802,
        {
            Name: "GetApprovalOpinion",
            Type: "EntityEdit/GetEntityData",
            EditView: "LoanReviewCommitteeApprovalOpinion",
            EditPropertiyViewList: ["LoanReviewCommitteeApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        //保存审核意见 SaveApprovalOpinion: 1803
        {
            Name: "SaveApprovalOpinion",
            Type: "EntityEdit/SaveEntityDataViews",
            ToPageUrl: "/Orders/HandledOrderList",
            EditPropertiyViewList: ["LoanReviewCommitteeApprovalOpinion2", "ApprovalLeftRightButtonView"],
            SetDisabledViewList: ["LoanReviewCommitteeApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        {
            Name: "ToAttachPage2",
            Type: "Page/ToAttachPage",
            DirType: 5 // 5：终审审核附件
        }
    ]
}