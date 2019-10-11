import { EntityPageList } from "PageTemplates";
import { Bill } from "ModelsConfigs";
import { Common } from "UtilsCommon";

export default EntityPageList("PurchaseSaleManage_BillList", "Bill", 2300, {
    ExpandInit() {
        if (this.PageData.DataCode) {
            this.Keyword = this.GetViewProperty(this.PageConfig, "Keyword");
            this.Keyword.IsReadOnly = true;
            this.Keyword.DefaultValue = this.PageData.DataCode;
        }
    },
    ExpandSetPageUrl(url) {
        if (this.PageData.DataCode) url = Common.AddUrlParams(url, "DataCode", this.PageData.DataCode);
        if (this.PageData.DataType) url = Common.AddUrlParams(url, "DataType", this.PageData.DataType);
        if (this.PageData.DataId) url = Common.AddUrlParams(url, "DataId", this.PageData.DataId);

        return url;
    }
}, Bill);