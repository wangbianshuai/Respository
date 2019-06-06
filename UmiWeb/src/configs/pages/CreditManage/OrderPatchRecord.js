import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import PatchRecord from "../../views/OrderPatch/PatchRecord";

const DataActionTypes = {
    //获取实体数据
    GetOrderInfoEntityData: 1000,
    //获取补件记录
    GetPatchRecordEntityData: 1001
};

export default {
    Name: "OrderPatchRecord",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo(DataActionTypes), PatchRecord(DataActionTypes, true)])
}

function GetEventActions() {
    return [{
        Name: "GetOrderInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "OrderInfo"
    },
    {
        Name: "GetPatchRecordEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "PatchRecord"
    },
    {
        Name: "ToAttachPage",
        Type: "Page/ToAttachPage"
    },
    {
        Name: "ToOrderDetail",
        Type: "Page/ToPage",
        PageUrl: "/CreditManage/OrderDetail?OrderCode=#{OrderCode}"
    }]
}