import { AssignProporties } from "../Common";

//权限管理/权限配置 3600-3699
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3600
}

export default {
    Name: "RightConfig",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}