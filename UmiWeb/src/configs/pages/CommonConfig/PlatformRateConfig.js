import { AssignProporties } from "../Common";

//公共配置/平台费率配置 2100-2199
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2100
}

export default {
    Name: "PlatformRateConfig",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}