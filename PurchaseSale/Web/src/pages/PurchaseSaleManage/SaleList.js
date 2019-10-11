import { EntityPageList } from "PageTemplates";
import { Sale } from "ModelsConfigs";

export default EntityPageList("PurchaseSaleManage_SaleList", "Sale", 2600, {
    ExpandInit() {
        if (this.PageData.SaleCode) {
            this.Keyword = this.GetViewProperty(this.PageConfig, "Keyword");
            this.Keyword.Value = this.PageData.SaleCode;
        }
    }
}, Sale);