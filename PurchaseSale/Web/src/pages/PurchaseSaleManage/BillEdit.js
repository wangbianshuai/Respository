import { EntityPageEdit } from "PageTemplates";
import { Bill } from "ModelsConfigs";
import { Common } from "UtilsCommon";

export default EntityPageEdit("PurchaseSaleManage_BillEdit", "Bill", 2400, {
    ExpandSetEntityData({ entityData, props, view }) {
        if (this.PageData.DataType) entityData.DataType = this.PageData.DataType;
        if (this.PageData.DataId) entityData.DataId = this.PageData.DataId;

        return entityData;
    },
    ExpandSetPageUrl(url) {
        if (this.PageData.DataCode) url = Common.AddUrlParams(url, "DataCode", this.PageData.DataCode);
        if (this.PageData.DataType) url = Common.AddUrlParams(url, "DataType", this.PageData.DataType);
        if (this.PageData.DataId) url = Common.AddUrlParams(url, "DataId", this.PageData.DataId);

        return url;
    }
}, Bill);
