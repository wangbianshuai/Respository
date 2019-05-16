import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import PatchRecord from "../../views/OrderPatch/PatchRecord";
import WaitConditionApprovalOpinion from "../../views/OrderApproval/WaitConditionApprovalOpinion";

//审核管理/等待签约条件审核 1900-1999
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1900
}

export default {
    Name: "WaitConditionAuditing",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo, PatchRecord, WaitConditionApprovalOpinion])
}

function GetEventActions() {
    return []
}