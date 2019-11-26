import ActionConfigs from "./ActionConfigs";

export default {
    ActionList: [ActionConfigs.GetProducts, ActionConfigs.GetUsers, ActionConfigs.UpdatePurchaseStatus2, ActionConfigs.UpdatePurchaseStatus3,ActionConfigs.GetSuppliers,
    get("GetEntityData", "ViewPurchase", "GetEntityData", "ViewPurchase", true)],
    ListActionNames: ["GetUsers", "UpdatePurchaseStatus2", "UpdatePurchaseStatus3", "GetEntityData"],
    EditActionNames: ["GetProducts", "GetUsers","GetSuppliers"],
    EditActionTypeKeys: ["SumbitEntityData", "AddDetail"],
    ListActionTypeKeys: ["UpdatePurchaseStatus2", "UpdatePurchaseStatus3", "GetEntityData"]
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}
