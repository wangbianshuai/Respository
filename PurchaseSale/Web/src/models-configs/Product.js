import ActionConfigs from "./ActionConfigs";

export default {
    ActionList: [ActionConfigs.GetUnits, ActionConfigs.GetProductTypes, ActionConfigs.GetProductBrands, ActionConfigs.UpdateProductStatus],
    ListActionNames: ["GetProductTypes", "GetProductBrands", "UpdateProductStatus"],
    EditActionNames: ["GetUnits", "GetProductTypes", "GetProductBrands"],
    ListActionTypeKeys: ["UpdateProductStatus"]
}
