import { AssignProporties } from "../Common";

//公共配置/平台服务费率编辑 3200-3299
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3200
}

export default {
    Name: "PlatformServiceRateEdit",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}