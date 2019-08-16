import EntityList from "./EntityList";
import EntityModelsConfig from "./EntityModelsConfig";

export default (name, enityName, minActionType) => {
    const config = {
        PageName: name,
        ActionNames: ["SearchQuery", "Delete"],
        ActionOptions: GetActionOptions(name, enityName, minActionType),
        ModelsConfig: EntityModelsConfig(enityName)
    };

    return EntityList(config);
}

function GetActionOptions(name, entityName, minActionType) {
    const ActionTypes = {
        //搜索查询
        SearchQuery: minActionType,
        //删除实体数据
        DeleteEntityData: minActionType + 1
    };

    return { Name: name, ServiceName: entityName + "Service", MinActionType: minActionType, MaxActionType: minActionType + 99, ActionTypes }
}