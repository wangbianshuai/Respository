import { EntityPageList } from "PageTemplates";
import { PurchaseDetail } from "ModelsConfigs";

export default EntityPageList("PurchaseSaleManage_PurchaseDetailList", "PurchaseDetail", 3000, {
    ExpandInit() {
        if (this.PageData.PurchaseCode) {
            this.Keyword = this.GetViewProperty(this.PageConfig, "Keyword");
            this.Keyword.Value = this.PageData.PurchaseCode;
        }
    }
}, PurchaseDetail);