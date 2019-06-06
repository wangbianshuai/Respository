import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import DataActions from "Actions";

//审核管理/反欺诈审核 1200-1299
const DataActionTypes = DataActions.GetActionTypes("Auditing_AntiFraudAuditing");

export default {
    Name: "AntiFraudAuditing",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo(DataActionTypes)])
}

function GetEventActions() {
    return [{
        Name: "GetOrderInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "OrderInfo"
    },
    {
        Name: "ToOrderDetail",
        Type: "Page/ToPage",
        PageUrl: "/CreditManage/OrderDetail?OrderCode=#{OrderCode}"
    }]
}