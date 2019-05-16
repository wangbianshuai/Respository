import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import FinalApprovalResult from "../../views/OrderApproval/FinalApprovalResult";
import FinalReviewApprovalOpinion from "../../views/OrderApproval/FinalReviewApprovalOpinion";

//审核管理/终审复核 1400-1499
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1400
}

export default {
    Name: "FinalReviewAuditing",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo, FinalApprovalResult, FinalReviewApprovalOpinion])
}

function GetEventActions() {
    return []
}