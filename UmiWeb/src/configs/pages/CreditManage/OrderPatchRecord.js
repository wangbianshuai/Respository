import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import PatchRecord from "../../views/OrderPatch/PatchRecord";

const DataActionTypes = {
    //获取实体数据
    GetEntityData: 900
};

export default {
    Name: "OrderPatchRecord",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo, PatchRecord])
}

function GetEventActions() {
    return []
}