import { AssignProporties } from "../Common";

//权限管理/角色管理 2700-2799
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2700
}

export default {
    Name: "RoleManage",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}