import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import PatchOperation from "../../views/OrderPatch/PatchOperation";

const DataActionTypes = {
    //获取实体数据
    GetOrderInfoEntityData: 900,
    //获取补件信息
    GetPatchInfoEntityData: 901,
    //保存补件信息
    SavePatchInfoEntityData: 902
};

export default {
    Name: "OrderPatchEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo(DataActionTypes), PatchOperation(DataActionTypes)])
}

function GetEventActions() {
    return [{
        Name: "GetOrderInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "OrderInfo"
    },
    {
        Name: "SavePatchInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PatchInfo",
        SetDisabledViewList: ["PatchInfo", "PatchInfoRightButtonView"]
    },
    {
        Name: "ToAttachPage",
        Type: "Page/ToAttachPage"
    },
    {
        Name: "GetPatchInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "PatchInfo"
    },
    {
        Name: "ToOrderDetail",
        Type: "Page/ToPage",
        PageUrl: "/CreditManage/OrderDetail?OrderCode=#{OrderCode}"
    }]
}