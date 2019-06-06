import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import LoanReviewApprovalOpinion from "../../views/OrderApproval/LoanReviewApprovalOpinion";
import LoanReviewOpinionRecord from "../../views/OrderApproval/LoanReviewOpinionRecord";
import DataActions from "Actions";

//审核管理/贷审会 1800-1899
const DataActionTypes = DataActions.GetActionTypes("Auditing_LoanReviewCommittee");

export default {
    Name: "LoanReviewCommittee",
    Type: "View",
    EventActions: GetEventActions(),
    Properties1: AssignProporties({}, [ReadBaseInfo(DataActionTypes), LoanReviewApprovalOpinion(DataActionTypes)]),
    Properties2: AssignProporties({}, [ReadBaseInfo(DataActionTypes), GetApprovalOpinionView(), LoanReviewOpinionRecord(DataActionTypes)])
}

function GetApprovalOpinionView() {
    return {
        Name: "FirstTrialApprovalOpinion2",
        Type: "View",
        ClassName: "DivView2",
        Title: "审核意见",
        Style: { marginTop: 8 },
        Properties: AssignProporties({}, [GetOpinionSpanText()])
    }
}

function GetOpinionSpanText() {
    return {
        Name: "OpinionText",
        Type: "SpanText",
        Style: { color: "#0099FF" },
        Text: "贷审会结论：通过"
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
            Type: "Page/ToPage",
            PageUrl: "/CreditManage/OrderDetail?OrderCode=#{OrderCode}"
        },
        //获取审核意见明细 GetApprovalOpinionDetails: 1801,
        {
            Name: "GetApprovalOpinionDetails",
            Type: "EntityEdit/GetEntityData",
            EditView: "LoanReviewOpinionRecord2"
        },
        //获取审核意见 GetApprovalOpinion: 1802,
        {
            Name: "GetApprovalOpinion",
            Type: "EntityEdit/GetEntityData",
            EditView: "FinalReviewApprovalOpinion",
            EditPropertiyViewList: ["LoanReviewCommitteeApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        //保存审核意见 SaveApprovalOpinion: 1803
        {
            Name: "SaveApprovalOpinion",
            Type: "EntityEdit/SaveEntityDataViews",
            EditPropertiyViewList: ["LoanReviewCommitteeApprovalOpinion2", "ApprovalLeftRightButtonView"],
            SetDisabledViewList: ["LoanReviewCommitteeApprovalOpinion2", "ApprovalLeftRightButtonView"]
        }
    ]
}