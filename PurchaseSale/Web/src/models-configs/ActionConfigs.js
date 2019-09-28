export default {
    GetUnits: get("GetUnits", "Dictionary2/GetUnits", "Units"),
    GetProductTypes: get("GetProductTypes", "ViewProductType?$select=Id,Name&$orderby CreateDate", "ProductTypes", "ViewProductType"),
    GetProductBrands: get("GetProductBrands", "ViewProductBrand?$select=Id,Name&$orderby CreateDate", "ProductBrands", "ViewProductBrand"),
    GetProductList:get("GetProductList", "ViewProduct?$select=Id,ProductName,CurrentStock,BidPrice&$orderby CreateDate", "ProductList", "ViewProduct"),
    GetUsers: get("GetUsers", "ViewUser?$select=UserId,UserName&$orderby CreateDate", "Users", "ViewUser")
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}
