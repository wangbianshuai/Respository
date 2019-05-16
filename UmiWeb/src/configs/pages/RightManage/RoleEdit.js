import { AssignProporties } from "../Common";

//权限管理/角色编辑 3800-3899
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3800
}

export default {
    Name: "RoleEdit",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}