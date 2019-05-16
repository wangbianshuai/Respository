import { AssignProporties } from "./Common";

//登录 4000-4099
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 4000
}

export default {
    Name: "Login",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}