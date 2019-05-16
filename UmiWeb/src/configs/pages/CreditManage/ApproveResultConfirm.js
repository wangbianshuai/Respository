import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import FinalApprovalResult from "../../views/OrderApproval/FinalApprovalResult";
import ApprovalOpinion from "../../views/OrderApproval/ApprovalOpinion";

const DataActionTypes = {
    //获取实体数据
    GetEntityData: 900
};

export default {
    Name: "ApproveResultConfirm",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo, FinalApprovalResult, ApprovalOpinion])
}

function GetEventActions() {
    return []
}