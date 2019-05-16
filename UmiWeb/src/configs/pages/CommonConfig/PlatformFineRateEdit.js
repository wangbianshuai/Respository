import { AssignProporties } from "../Common";

//公共配置/平台罚息费率编辑 3000-3099
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3000
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