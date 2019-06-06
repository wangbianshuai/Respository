import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import PatchRecord from "../../views/OrderPatch/PatchRecord";
import WaitConditionApprovalOpinion from "../../views/OrderApproval/WaitConditionApprovalOpinion";
import DataActions from "Actions";

//审核管理/等待签约条件审核 1900-1999
const DataActionTypes = DataActions.GetActionTypes("Auditing_LoanReviewCommittee");

export default {
    Name: "WaitConditionAuditing",
    Type: "View",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo(DataActionTypes), PatchRecord(DataActionTypes, true), WaitConditionApprovalOpinion(DataActionTypes)])
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
            Type: "Page/ToPage",
            PageUrl: "/CreditManage/OrderDetail?OrderCode=#{OrderCode}"
        },
        //获取补件信息 GetPatchRecordInfo: 1901,
        {
            Name: "GetPatchRecordInfo",
            Type: "EntityEdit/GetEntityData",
            EditView: "PatchRecord2"
        },
        //获取审核意见 GetApprovalOpinion: 1902,
        {
            Name: "GetApprovalOpinion",
            Type: "EntityEdit/GetEntityData",
            EditView: "FinalReviewApprovalOpinion",
            EditPropertiyViewList: ["WaitConditionAuditingApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        //保存审核意见 SaveApprovalOpinion: 1903
        {
            Name: "SaveApprovalOpinion",
            Type: "EntityEdit/SaveEntityDataViews",
            EditPropertiyViewList: ["WaitConditionAuditingApprovalOpinion2", "ApprovalLeftRightButtonView"],
            SetDisabledViewList: ["WaitConditionAuditingApprovalOpinion2", "ApprovalLeftRightButtonView"]
        }
    ]
}