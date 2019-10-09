import { EntityPageEdit } from "PageTemplates";
import { Sale } from "ModelsConfigs";
import { Common } from "UtilsCommon";

export default EntityPageEdit("PurchaseSaleManage_SaleInput", "Sale", 2500, {
    SetDetailEntityData({ entityData, props, view }) {
        if (!this.ProductIdProperty) this.ProductIdProperty = this.GetViewProperty(view, "ProductId");
        const selectData = this.ProductIdProperty.GetSelectData();
        entityData.Discount = selectData.SillingPrice - entityData.SillingPrice;
        entityData.BidPrice = selectData.BidPrice;
        entityData.ProductTypeName = selectData.ProductTypeName;
        entityData.ProductBrandName = selectData.ProductBrandName;
        entityData.Unit = selectData.Unit;
        entityData.Amount = Common.GetNumber(Common.GetNumber(entityData.SillingPrice) * Common.GetNumber(entityData.Number))
        entityData.Id = Common.CreateGuid();

        return entityData;
    },
    SetDetailEntityDataCallback({ data, props, action }) {
        if (data.IsSuccess !== false) {

        }
    },
    componentDidMount() {
        this.DetailsGridView = this.GetViewProperty(this.PageConfig, "Details");
    }
}, Sale);
