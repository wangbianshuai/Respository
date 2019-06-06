import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import ReadRefundOrder from "../../views/Order/ReadRefundOrder";
import IndeedApproval from "../../views/OrderApproval/IndeedApproval";
import DataActions from "Actions";

//审核管理/实地审核 1700-1799
const DataActionTypes = DataActions.GetActionTypes("Auditing_IndeedAuditing");

export default {
    Name: "IndeedAuditing",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo(DataActionTypes), ReadRefundOrder(DataActionTypes, true), IndeedApproval(DataActionTypes)])
}

function GetEventActions() {
    return [
        //获取订单基本信息实体数据 GetOrderInfoEntityData: 1700,
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
        //获取退单信息 GetExitOrderInfo: 1701,
        {
            Name: "GetExitOrderInfo",
            Type: "EntityEdit/GetEntityData",
            EditView: "ReadRefundOrder"
        },
        //获取审核意见 GetApprovalOpinion: 1702,
        {
            Name: "GetApprovalOpinion",
            Type: "EntityEdit/GetEntityData",
            EditView: "IndeedApprovalOpinion",
            EditPropertiyViewList: ["IndeedApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        //保存审核意见 SaveApprovalOpinion: 1703
        {
            Name: "SaveApprovalOpinion",
            Type: "EntityEdit/SaveEntityDataViews",
            EditPropertiyViewList: ["IndeedApprovalOpinion2", "ApprovalLeftRightButtonView"],
            SetDisabledViewList: ["IndeedApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        {
            Name: "ToAttachPage",
            Type: "Page/ToAttachPage"
        }
    ]
}