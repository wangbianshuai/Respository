import EntityPage from "./EntityPage";
import EntityModelsConfig from "./EntityModelsConfig";

export default (name, enityName, minActionType, pageExpand, expandModelsConfig) => {
    const config = {
        PageName: name,
        ActionNames: ["SearchQuery", "Delete", "ExcelExport"],
        ActionOptions: GetActionOptions(name, enityName, minActionType, expandModelsConfig),
        ModelsConfig: EntityModelsConfig(enityName),
        PageExpand: pageExpand
    };

    if (expandModelsConfig) {
        config.ModelsConfig.ActionList = config.ModelsConfig.ActionList.concat(expandModelsConfig.ActionList);
        if (expandModelsConfig.ListActionNames) config.ActionNames = config.ActionNames.concat(expandModelsConfig.ListActionNames);
    }

    return EntityPage("EntityList", config);
}

function GetActionOptions(name, entityName, minActionType, expandModelsConfig) {
    var ActionType = minActionType;

    const ActionTypes = {
        //搜索查询
        SearchQuery: GetActionType(),
        //删除实体数据
        DeleteEntityData: GetActionType(),
        //Excel导出
        ExcelExport: GetActionType()
    };

    if (expandModelsConfig && expandModelsConfig.ListActionTypeKeys) {
        expandModelsConfig.ListActionTypeKeys.forEach(a => ActionTypes[a] = GetActionType())
    }

    function GetActionType() {
        var type = ActionType;
        ActionType += 1;
        return type;
    }

    return { Name: name, ServiceName: entityName + "Service", MinActionType: minActionType, MaxActionType: minActionType + 99, ActionTypes }
}