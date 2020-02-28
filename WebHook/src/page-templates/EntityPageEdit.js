import EntityPage from "./EntityPage";
import EntityModelsConfig from "./EntityModelsConfig";

export default (name, enityName, minActionType, pageExpand, expandModelsConfig) => {
    const config = {
        PageName: name,
        ActionNames: ["GetEntityData", "Insert", "Update"],
        ActionOptions: GetActionOptions(name, enityName, minActionType, expandModelsConfig),
        ModelsConfig: EntityModelsConfig(enityName),
        PageExpand: pageExpand
    };

    if (expandModelsConfig) {
        config.ModelsConfig.ActionList = config.ModelsConfig.ActionList.concat(expandModelsConfig.ActionList);
        if (expandModelsConfig.EditActionNames) config.ActionNames = config.ActionNames.concat(expandModelsConfig.EditActionNames);
    }

    return EntityPage("EntityEdit", config);
}

function GetActionOptions(name, entityName, minActionType, expandModelsConfig) {
    var ActionType = minActionType;

    const ActionTypes = {
        //获取实体数据
        GetEntityData: GetActionType(),
        //保存实体数据
        SaveEntityData: GetActionType()
    };

    if (expandModelsConfig && expandModelsConfig.EditActionTypeKeys) {
        expandModelsConfig.EditActionTypeKeys.forEach(a => ActionTypes[a] = GetActionType())
    }

    function GetActionType() {
        var type = ActionType;
        ActionType += 1;
        return type;
    }

    return { Name: name, ServiceName: entityName + "Service", MinActionType: minActionType, MaxActionType: minActionType + 99, ActionTypes }
}

