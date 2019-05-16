import { AssignProporties } from "../Common";

//公共配置/平台管理费率编辑 3100-3199
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3100
}

export default {
    Name: "PlatformFineRateEdit",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}