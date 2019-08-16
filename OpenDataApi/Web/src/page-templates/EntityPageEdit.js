import EntityEdit from "./EntityEdit";
import EntityModelsConfig from "./EntityModelsConfig";

export default (name, enityName, minActionType, pageExpand) => {
    const config = {
        PageName: name,
        ActionNames: ["GetEntityData", "Insert", "Update"],
        ActionOptions: GetActionOptions(name, enityName, minActionType),
        ModelsConfig: EntityModelsConfig(enityName),
        PageExpand: pageExpand
    };

    return EntityEdit(config);
}

function GetActionOptions(name, entityName, minActionType) {
    const ActionTypes = {
        //获取实体数据
        GetEntityData: minActionType,
        //保存实体数据
        SaveEntityData: minActionType + 1
    };

    return { Name: name, ServiceName: entityName + "Service", MinActionType: minActionType, MaxActionType: minActionType + 99, ActionTypes }
}