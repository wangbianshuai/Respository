import { AssignProporties } from "../Common";

//权限管理/用户编辑 3900-3999
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3900
}

export default {
    Name: "UserEdit",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}