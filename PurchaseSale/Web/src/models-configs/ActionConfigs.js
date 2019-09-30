export default {
    GetUnits: get("GetUnits", "Dictionary2/GetUnits", "Units"),
    GetProductTypes: get("GetProductTypes", "ViewProductType?$select=Id,Name&$orderby CreateDate", "ProductTypes", "ViewProductType"),
    GetProductBrands: get("GetProductBrands", "ViewProductBrand?$select=Id,Name&$orderby CreateDate", "ProductBrands", "ViewProductBrand"),
    GetProductList: get("GetProductList", "ViewProduct?$select=Id,ProductName,CurrentStock,BidPrice&$orderby CreateDate&$filter=ProductStatus eq 0", "ProductList", "ViewProduct"),
    GetUsers: get("GetUsers", "ViewUser?$select=UserId,UserName&$orderby CreateDate", "Users", "ViewUser"),
    GetPersonBillTypes: get("GetPersonBillTypes", "ViewPersonBillType?$select=Id,Name,IncomePayment&$orderby CreateDate", "PersonBillTypes", "ViewPersonBillType"),
    GetBillTypes: get("GetBillTypes", "ViewBillType?$select=Id,Name,IncomePayment&$orderby CreateDate", "BillTypes", "ViewBillType"),
    UpdateProductStatus: post("UpdateProductStatus", "Product/UpdateStatus", "UpdateStatus", "", true),
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}

function post(actionName, url, stateName, dataKey, IsToken) {
    return { ActionName: actionName, Url: url, Method: "POST", StateName: stateName, DataKey: dataKey, IsToken }
}