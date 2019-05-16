import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import ReadRefundOrder from "../../views/Order/ReadRefundOrder";
import IndeedApproval from "../../views/OrderApproval/IndeedApproval";

//审核管理/实地审核 1700-1799
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1700
}

export default {
    Name: "IndeedAuditing",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo, ReadRefundOrder, IndeedApproval])
}

function GetEventActions() {
    return []
}