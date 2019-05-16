import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import PatchOperation from "../../views/OrderPatch/PatchOperation";

const DataActionTypes = {
    //获取实体数据
    GetEntityData: 900
};

export default {
    Name: "OrderPatchEdit",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo, PatchOperation])
}

function GetEventActions() {
    return []
}