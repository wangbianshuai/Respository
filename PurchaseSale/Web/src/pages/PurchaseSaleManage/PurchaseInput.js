import { EntityPageEdit } from "PageTemplates";
import { Purchase } from "ModelsConfigs";
import { Common } from "UtilsCommon";

export default EntityPageEdit("PurchaseSaleManage_PurchaseInput", "Purchase", 2800, {
    SetDetailEntityData({ entityData, props, view }) {
        if (!this.ProductIdProperty) this.ProductIdProperty = this.GetViewProperty(view, "ProductId");
        const selectData = this.ProductIdProperty.GetSelectData();
        entityData.Discount = Common.GetNumber(selectData.BidPrice * Common.GetNumber(entityData.Number) - entityData.Amount);
        entityData.ProductTypeName = selectData.ProductTypeName;
        entityData.ProductBrandName = selectData.ProductBrandName;
        entityData.ProductName = selectData.ProductName;
        entityData.Unit = selectData.Unit;
        entityData.Id = Common.CreateGuid();

        return entityData;
    },
    SetDetailEntityDataCallback({ data, props, action }) {
        if (data.IsSuccess !== false && data.EntityData) this.DetailsGridView.Add(data.EntityData);
    },
    SubmitEntityDataCallback({ data, props, action }) {
        if (data.IsSuccess !== false) {
            const onOk = () => {
                if (!data.PrimaryKey) this.ToPage("/PurchasePurchaseManage/PurchaseList");
            };

            this.AlertSuccess("提交成功", onOk);
        }
    },
    componentDidMount() {
        this.DetailsGridView = this.GetViewProperty(this.PageConfig, "Details");
        this.DetailsGridView.SetChangeDataList = this.SetChangeDataList.bind(this);

        this.PurchaseEdit2 = this.GetViewProperty(this.PageConfig, "PurchaseEdit2");
        this.SumAmount = this.GetViewProperty(this.PurchaseEdit2, "SumAmount");
        this.LogisticsFee = this.GetViewProperty(this.PurchaseEdit2, "LogisticsFee");
        this.OtherFee = this.GetViewProperty(this.PurchaseEdit2, "OtherFee");
        this.DiscountFee = this.GetViewProperty(this.PurchaseEdit2, "DiscountFee");
        this.ShouldAmount = this.GetViewProperty(this.PurchaseEdit2, "ShouldAmount");
        this.RealAmount = this.GetViewProperty(this.PurchaseEdit2, "RealAmount");
        this.PurchaseType = this.GetViewProperty(this.PurchaseEdit2, "PurchaseType");

        this.LogisticsFee.ValueChange = this.LogisticsFeeValueChange.bind(this);
        this.OtherFee.ValueChange = this.OtherFeeValueChange.bind(this);
        this.DiscountFee.ValueChange = this.DiscountFeeValueChange.bind(this);
        this.PurchaseType.ValueChange = this.PurchaseTypeValueChange.bind(this);

        this.DetailEditView = this.GetViewProperty(this.PageConfig, "DetailEditView");
        this.BidPrice = this.GetViewProperty(this.DetailEditView, "BidPrice");
        this.Number = this.GetViewProperty(this.DetailEditView, "Number");
        this.Amount = this.GetViewProperty(this.DetailEditView, "Amount");

        this.BidPrice.ValueChange = this.BidPriceValueChange.bind(this);
        this.Number.ValueChange = this.NumberValueChange.bind(this);
    },
    BidPriceValueChange(value) {
        this.ComputeProductAmount(Common.GetNumber(value), null);
    },
    NumberValueChange(value) {
        this.ComputeProductAmount(null, Common.GetNumber(value));
    },
    ComputeProductAmount(bidPrice, number) {
        if (bidPrice === null) bidPrice = Common.GetNumber(this.BidPrice.GetValue());
        if (number === null) number = Common.GetNumber(this.Number.GetValue());

        this.Amount.SetValue(Common.GetNumber(bidPrice * number, 2));
    },
    SetChangeDataList(dataList) {
        dataList = dataList || [];
        let sumAmount = 0;
        dataList.forEach(d => {
            sumAmount += Common.GetNumber(d.Amount)
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
    PurchaseTypeValueChange(value) {
        const isPurchase = Common.IsEquals(value, 1);
        this.ShouldAmount.SetLabel(isPurchase ? "应付金额" : "应收金额");
        this.RealAmount.SetLabel(isPurchase ? "实付金额" : "实收金额");
    }
}, Purchase);
