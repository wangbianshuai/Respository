import { AssignProporties } from "../Common";

//个人中心/基本信息 2600-2699
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2600
}

export default {
    Name: "BaseInfo",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [])
}

function GetEventActions() {
    return []
}