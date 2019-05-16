import { AssignProporties } from "../Common";

//公共配置/还款方式编辑 2900-2999
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2900
}

export default {
    Name: "BackMethodEdit",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}