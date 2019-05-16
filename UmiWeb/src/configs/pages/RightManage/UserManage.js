import { AssignProporties } from "../Common";

//权限管理/用户管理 2800-2899
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2800
}

export default {
    Name: "UserManage",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}