import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";

//审核管理/反欺诈审核 1200-1299
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1200
};

export default {
    Name: "AntiFraudAuditing",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo])
}

function GetEventActions() {
    return []
}