import * as Common from "../utils/Common";

export default class OrderEdit {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.PageConfig.TabViews[0].EditView.Properties.forEach(p => {
            if (p.Name === "Amount") this.AmountProperty = p;
            else if (p.Name === "ExtraCharge") this.ExtraChargeProperty = p;
            else if (p.Name === "ActualAmount") {
                this.ActualAmountProperty = p;
                p.ValueChange = this.ActualAmountChange.bind(this);
            }
            else if (p.Name === "DiscountRate") {
                this.DiscountRateProperty = p;
                p.ValueChange = this.DiscountRateChange.bind(this);
            }
            else if (p.Name === "CostAmount") {
                this.CostAmountProperty = p;
                p.ValueChange = this.CostAmountChange.bind(this);
            }
            else if (p.Name === "ProcessAmount") {
                this.ProcessAmountProperty = p;
                p.ValueChange = this.ProcessAmountChange.bind(this);
            }
            else if (p.Name === "Profit") this.ProfitProperty = p;
            else if (p.Name === "PaidDeposit") {
                this.PaidDepositProperty = p;
                p.ValueChange = this.PaidDepositChange.bind(this);
            }
            else if (p.Name === "ShouldPayBalance") this.ShouldPayBalanceProperty = p;
        });

        this.Page.SetAmountExtraCharge = this.SetAmountExtraCharge.bind(this);

        const id = Common.GetObjValue(this.Page.QueryString, "OrderId");
        this.Page.IsEdit = !Common.IsNullOrEmpty(id);

        this.Page.IsEdit && this.PageConfig.OperationView.Properties.forEach(p => {
            if (p.Name !== "AddAction" && p.Name !== "OrderPdfAction" && p.Name !== "BillAction") p.IsDataRight = false;
        });

        this.PageConfig.TabViews[0].EditView.DataLoad = this.EditViewDataLoad.bind(this)
    }

    EditViewDataLoad() {
        const { EntityData } = this.PageConfig.TabViews[0].EditView;
        if (EntityData && EntityData.OrderStatus > 0) {
            this.PageConfig.TabViews[0].EditView.Properties.forEach(p => {
                if (!p.IsReadonly) p.IsReadonly = true;
                if (p.SetReadonly) p.SetReadonly(true);
            })
        }

        this.SetOperationButtons();
    };

    SetOperationButtons() {
        const { EntityData } = this.PageConfig.TabViews[0].EditView;

        if (EntityData) {
            const s = EntityData.OrderStatus;

            this.PageConfig.OperationView.Properties.forEach(p => {
                if (p.Name === "SaveAction" || p.Name === "DeleteAction") this.SetButtonVisible(p, s === 0);
                else if (p.Name === "UpdateStatus1Action") this.SetButtonVisible(p, s === 0);
                else if (p.Name === "UpdateStatus2Action" || p.Name === "UpdateStatus0Action" || p.Name === "CheckPrcoessAmountAction") this.SetButtonVisible(p, s === 1);
                else if (p.Name === "ProcessOrderPdfAction") this.SetButtonVisible(p, s > 0)
            });

            this.PageConfig.OperationView.RefreshVisible();
        }
    }

    SetButtonVisible(p, blVisible) {
        p.IsDataRight = blVisible;
    }

    PaidDepositChange(value) {
        const paidDeposit = Common.GetFloatValue(value);
        this.ComputeShouldPayBalance(paidDeposit, null)
    }

    ComputeShouldPayBalance(paidDeposit, actualAmount) {
        paidDeposit = paidDeposit === null ? Common.GetFloatValue(this.PaidDepositProperty.GetValue()) : paidDeposit;
        actualAmount = actualAmount === null ? Common.GetFloatValue(this.ActualAmountProperty.GetValue()) : actualAmount;

        const shouldPayBalance = actualAmount - paidDeposit;
        this.ShouldPayBalanceProperty.SetValue(shouldPayBalance);
    }

    CostAmountChange(value) {
        const costAmount = Common.GetFloatValue(value);
        this.ComputeProfit(costAmount, null, null)
    }

    ProcessAmountChange(value) {
        const processAmount = Common.GetFloatValue(value);
        this.ComputeProfit(null, null, processAmount)
    }

    ComputeProfit(costAmount, actualAmount, processAmount) {
        costAmount = costAmount === null ? Common.GetFloatValue(this.CostAmountProperty.GetValue()) : costAmount;
        actualAmount = actualAmount === null ? Common.GetFloatValue(this.ActualAmountProperty.GetValue()) : actualAmount;
        processAmount = processAmount === null ? Common.GetFloatValue(this.ProcessAmountProperty.GetValue()) : processAmount;

        const profit = actualAmount - costAmount - processAmount;

        this.ProfitProperty.SetValue(profit);
    }

    DiscountRateChange(value, amount, extraChange) {
        if (amount === undefined) amount = Common.GetFloatValue(this.AmountProperty.GetValue());
        if (extraChange === undefined) extraChange = Common.GetFloatValue(this.ExtraChargeProperty.GetValue());

        let rate = Common.GetFloatValue(value);
        if (rate > 0 && rate < 100) {
            amount = Math.round(amount * rate / 100);
        }

        const actualAmount = amount + extraChange;
        this.ActualAmountProperty.SetValue(actualAmount);
        this.ActualAmountChange(actualAmount)
    }

    ActualAmountChange(value) {
        const actualAmount = Common.GetFloatValue(value);
        this.ComputeProfit(null, actualAmount, null);
        this.ComputeShouldPayBalance(null, actualAmount);
    }

    SetAmountExtraCharge(amount, extraChange) {
        if (!this.AmountProperty.SetValue) return;

        this.AmountProperty.SetValue(amount);
        this.ExtraChargeProperty.SetValue(extraChange);

        this.DiscountRateChange(this.DiscountRateProperty.GetValue(), amount, extraChange)
    }
}