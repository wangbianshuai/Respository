import ActionConfigs from "./ActionConfigs";

export default {
    ActionList: [ActionConfigs.GetProducts, ActionConfigs.GetUsers, ActionConfigs.UpdateSaleStatus2, ActionConfigs.UpdateSaleStatus3,
    get("GetEntityData", "ViewSale", "GetEntityData", "ViewSale", true)],
    ListActionNames: ["GetUsers", "UpdateSaleStatus2", "UpdateSaleStatus3", "GetEntityData"],
    EditActionNames: ["GetProducts", "GetUsers"],
    EditActionTypeKeys: ["SumbitEntityData", "AddDetail"],
    ListActionTypeKeys: ["UpdateSaleStatus2", "UpdateSaleStatus3", "GetEntityData"]
}


function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}
