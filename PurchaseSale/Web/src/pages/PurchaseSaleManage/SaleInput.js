import { EntityPageEdit } from "PageTemplates";
import { Sale } from "ModelsConfigs";

export default EntityPageEdit("PurchaseSaleManage_SaleInput", "Sale", 2500, {
    SetDetailEntityData({ entityData, props, view }) {
        if (!this.ProductIdProperty) this.ProductIdProperty = this.GetViewProperty(view, "ProductId");
        const selectData = this.ProductIdProperty.GetSelectData();
        entityData.Discount = selectData.SillingPrice - entityData.SillingPrice;
        entityData.BidPrice = selectData.BidPrice;

        return entityData;
    }
}, Sale);
