import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("ProductManage_ProductEdit", "Product", 1000, null, (config) => {
    config.ModelsConfig.ActionList.push(get("GetUnits", "Dictionary2/GetUnits", "Units"));
    config.ModelsConfig.ActionList.push(get("GetProductTypes", "ViewProductType?$select=Id,Name&$orderby CreateDate", "ProductTypes","ViewProductType"));
    config.ModelsConfig.ActionList.push(get("GetProductBrands", "ViewProductBrand?$select=Id,Name&$orderby CreateDate","ProductBrands", "ViewProductBrand"));
});

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", IsExpand:true, StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}
