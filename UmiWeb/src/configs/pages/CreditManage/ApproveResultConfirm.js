import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import FinalApprovalResult from "../../views/OrderApproval/FinalApprovalResult";
import ApprovalOpinion from "../../views/OrderApproval/ApprovalOpinion";

import DataActions from "Actions";

//信贷管理/审批结论确认 1100-1199
const DataActionTypes = DataActions.GetActionTypes("CreditManage_ApproveResultConfirm");

export default {
    Name: "ApproveResultConfirm",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo(DataActionTypes), FinalApprovalResult(DataActionTypes), ApprovalOpinion(DataActionTypes)])
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
        EditPropertiyViewList: ["ApprovalOpinion2", "ApprovalOpinionRightButtonView"],
        SetDisabledViewList: ["ApprovalOpinion2", "ApprovalOpinionRightButtonView"]
    },
    {
        Name: "ToAttachPage",
        Type: "Page/ToAttachPage"
    },
    {
        Name: "GetFinalApprovalResult",
        Type: "EntityEdit/GetEntityData",
        EditView: "FinalApprovalResult"
    },
    {
        Name: "ToOrderDetail",
        Type: "Page/ToPage",
        PageUrl: "/CreditManage/OrderDetail?OrderCode=#{OrderCode}"
    }]
}