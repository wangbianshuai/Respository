import { AssignProporties } from "../Common";

//权限管理/角色配置 3700-3799
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3700
}

export default {
    Name: "RoleConfig",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}