import { EntityPageList } from "PageTemplates";
import { SaleDetail } from "ModelsConfigs";

export default EntityPageList("PurchaseSaleManage_SaleDetailList", "SaleDetail", 2700, {
    ExpandInit() {
        if (this.PageData.SaleCode) {
            this.Keyword = this.GetViewProperty(this.PageConfig, "Keyword");
            this.Keyword.Value = this.PageData.SaleCode;
        }
    }
}, SaleDetail);