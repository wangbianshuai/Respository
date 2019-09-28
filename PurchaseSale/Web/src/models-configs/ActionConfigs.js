export default {
    GetUnits: get("GetUnits", "Dictionary2/GetUnits", "Units"),
    GetProductTypes: get("GetProductTypes", "ViewProductType?$select=Id,Name&$orderby CreateDate", "ProductTypes", "ViewProductType"),
    GetProductBrands: get("GetProductBrands", "ViewProductBrand?$select=Id,Name&$orderby CreateDate", "ProductBrands", "ViewProductBrand")
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}
