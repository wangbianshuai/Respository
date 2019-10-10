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
        entityData.ProductName = selectData.ProductName;
        entityData.Unit = selectData.Unit;
        entityData.Amount = Common.GetNumber(Common.GetNumber(entityData.SillingPrice) * Common.GetNumber(entityData.Number))
        entityData.Id = Common.CreateGuid();

        return entityData;
    },
    SetDetailEntityDataCallback({ data, props, action }) {
        if (data.IsSuccess !== false && data.EntityData) this.DetailsGridView.Add(data.EntityData);
    },
    SubmitEntityDataCallback({ data, props, action }) {
        if (data.IsSuccess !== false) {
            const onOk = () => {
                if (!data.PrimaryKey) this.ToPage("/PurchaseSaleManage/SaleList");
            };

            this.AlertSuccess("提交成功", onOk);
        }
    },
    componentDidMount() {
        this.DetailsGridView = this.GetViewProperty(this.PageConfig, "Details");
        this.DetailsGridView.SetChangeDataList = this.SetChangeDataList.bind(this);

        this.SaleEdit2 = this.GetViewProperty(this.PageConfig, "SaleEdit2");
        this.SumAmount = this.GetViewProperty(this.SaleEdit2, "SumAmount");
        this.LogisticsFee = this.GetViewProperty(this.SaleEdit2, "LogisticsFee");
        this.OtherFee = this.GetViewProperty(this.SaleEdit2, "OtherFee");
        this.DiscountFee = this.GetViewProperty(this.SaleEdit2, "DiscountFee");
        this.ShouldAmount = this.GetViewProperty(this.SaleEdit2, "ShouldAmount");
        this.RealAmount = this.GetViewProperty(this.SaleEdit2, "RealAmount");
        this.SaleType = this.GetViewProperty(this.SaleEdit2, "SaleType");

        this.LogisticsFee.ValueChange = this.LogisticsFeeValueChange.bind(this);
        this.OtherFee.ValueChange = this.OtherFeeValueChange.bind(this);
        this.DiscountFee.ValueChange = this.DiscountFeeValueChange.bind(this);
        this.SaleType.ValueChange = this.SaleTypeValueChange.bind(this);
    },
    SetChangeDataList(dataList) {
        dataList = dataList || [];
        let sumAmount = 0;
        dataList.forEach(d => {
            sumAmount += d.Amount
        });
        sumAmount = Common.GetNumber(sumAmount);
        this.SumAmount.SetValue(sumAmount);
        this.ComputeShouldAmount(sumAmount, null, null, null);
    },
    ComputeShouldAmount(sumAmount, logisticsFee, otherFee, discountFee) {
        if (sumAmount === null) sumAmount = Common.GetNumber(this.SumAmount.GetValue());
        if (logisticsFee === null) logisticsFee = Common.GetNumber(this.LogisticsFee.GetValue());
        if (otherFee === null) otherFee = Common.GetNumber(this.OtherFee.GetValue());
        if (discountFee === null) discountFee = Common.GetNumber(this.DiscountFee.GetValue());

        const shouldAmount = Common.GetNumber(sumAmount + logisticsFee + otherFee - discountFee);
        this.ShouldAmount.SetValue(shouldAmount);
        this.RealAmount.SetValue(shouldAmount);
    },
    LogisticsFeeValueChange(value) {
        this.ComputeShouldAmount(null, Common.GetNumber(value), null, null);
    },
    OtherFeeValueChange(value) {
        this.ComputeShouldAmount(null, null, Common.GetNumber(value), null);
    },
    DiscountFeeValueChange(value) {
        this.ComputeShouldAmount(null, null, null, Common.GetNumber(value));
    },
    SaleTypeValueChange(value) {
        const isSale = Common.IsEquals(value, 1);
        this.ShouldAmount.SetLabel(isSale ? "应收金额" : "应付金额");
        this.RealAmount.SetLabel(isSale ? "实收金额" : "实付金额");
    }
}, Sale);
