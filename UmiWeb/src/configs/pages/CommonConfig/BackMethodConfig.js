import { AssignProporties } from "../Common";

//公共配置/还款方式配置 2000-2099
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2000
}

export default {
    Name: "BackMethodConfig",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}