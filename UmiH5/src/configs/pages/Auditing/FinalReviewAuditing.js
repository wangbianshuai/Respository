import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import FinalApprovalResult from "../../views/OrderApproval/FinalApprovalResult";
import FinalReviewApprovalOpinion from "../../views/OrderApproval/FinalReviewApprovalOpinion";
import DataActions from "Actions";

//审核管理/终审复核 1400-1499
const DataActionTypes = DataActions.GetActionTypes("Auditing_FinalReviewAuditing");

export default {
    Name: "FinalReviewAuditing",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo(DataActionTypes), FinalApprovalResult(DataActionTypes), FinalReviewApprovalOpinion(DataActionTypes)])
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
            Type: "Page/ToPage",
            PageUrl: "/CreditManage/OrderDetail?OrderCode=#{OrderCode}"
        },
        //获取终审授信结论信息 GetFinalApprovalResult: 1401,
        {
            Name: "GetFinalApprovalResult",
            Type: "EntityEdit/GetEntityData",
            EditView: "FinalApprovalResult2"
        },
        //获取审核意见 GetApprovalOpinion: 1402,
        {
            Name: "GetApprovalOpinion",
            Type: "EntityEdit/GetEntityData",
            EditView: "FinalReviewApprovalOpinion",
            EditPropertiyViewList: ["FinalReviewApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        //保存审核意见 SaveApprovalOpinion: 1403
        {
            Name: "SaveApprovalOpinion",
            Type: "EntityEdit/SaveEntityDataViews",
            EditPropertiyViewList: ["FinalReviewApprovalOpinion2", "ApprovalLeftRightButtonView"],
            SetDisabledViewList: ["FinalReviewApprovalOpinion2", "ApprovalLeftRightButtonView"]
        }
    ]
}