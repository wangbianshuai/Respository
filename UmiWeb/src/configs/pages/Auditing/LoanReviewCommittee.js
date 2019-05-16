import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import LoanReviewApprovalOpinion from "../../views/OrderApproval/LoanReviewApprovalOpinion";
import LoanReviewOpinionRecord from "../../views/OrderApproval/LoanReviewOpinionRecord";

//审核管理/贷审会 1800-1899
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1800
}

export default {
    Name: "LoanReviewCommittee",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties1: AssignProporties({}, [ReadBaseInfo, LoanReviewApprovalOpinion]),
    Properties2: AssignProporties({}, [ReadBaseInfo, GetApprovalOpinionView(), LoanReviewOpinionRecord])
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
    return []
}