const ActionList = GetActionList();
const ActionNames = ActionList.map(m => m.ActionName);

export default {
    ActionList,
    ListActionNames: ActionNames,
    EditActionNames: ActionNames
}

function GetActionList() {
    return [
        get("GetUnits", "Dictionary2/GetUnits", "Units"),
        get("GetProductTypes", "ViewProductType?$select=Id,Name&$orderby CreateDate", "ProductTypes", "ViewProductType"),
        get("GetProductBrands", "ViewProductBrand?$select=Id,Name&$orderby CreateDate", "ProductBrands", "ViewProductBrand")
    ]
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}
