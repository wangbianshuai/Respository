import { EntityPageList } from "PageTemplates";
import { Purchase } from "ModelsConfigs";

export default EntityPageList("PurchaseSaleManage_PurchaseList", "Purchase", 2900, {
    ExpandInit() {
        if (this.PageData.PurchaseCode) {
            this.Keyword = this.GetViewProperty(this.PageConfig, "Keyword");
            this.Keyword.Value = this.PageData.PurchaseCode;
        }
    }
}, Purchase);