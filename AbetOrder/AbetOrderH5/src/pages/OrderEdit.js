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

        this.PageConfig.TabViews[0].EditView.DataLoad = this.EditViewDataLoad.bind(this);

        this.ExpandActions();
    }

    ExpandActions() {
        this.Page.ExpandActions.ToBill = this.ToBill.bind(this);
        this.Page.ExpandActions.OrderPdf = this.OrderPdf.bind(this);
        this.Page.ExpandActions.ProcessOrderPdf = this.ProcessOrderPdf.bind(this);
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

        if (EntityData && EntityData.CreateUser === this.Page.LoginUser.UserId) {
            const s = EntityData.OrderStatus;

            this.PageConfig.OperationView.Properties.forEach(p => {
                if (p.Name === "SaveAction" || p.Name === "DeleteAction") this.SetButtonVisible(p, s === 0);
                else if (p.Name === "UpdateStatus1Action") this.SetButtonVisible(p, s === 0);
                else if (p.Name === "UpdateStatus2Action" || p.Name === "UpdateStatus0Action") this.SetButtonVisible(p, s === 1);
                else if (p.Name === "ProcessOrderPdfAction") this.SetButtonVisible(p, s > 0);
                else if (p.Name === "CheckPrcoessAmountAction" && s === 1 && EntityData.ProcessAmount > 0 && EntityData.BillStatus === 0) {
                    p.IsDataRight = true;
                    p.ConfirmMessage = "确认要审核通过加工费：" + Common.ToCurrency(EntityData.ProcessAmount, false) + "元吗？";
                }
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

    ToBill(property, params) {
        const { EntityData } = this.PageConfig;
        if (!EntityData) return;

        let url = "/Bill?OrderName2=" + escape(EntityData.OrderCode) + "&OrderId=" + EntityData.OrderId;
        this.Page.props.ToPage(url);
    }

    OrderPdf(property, params) {
        this.OpenPdf("B17DC2B1-AF38-4C79-AAE3-3C784CAC6F98", "订单");
    }

    ProcessOrderPdf(property, params) {
        this.OpenPdf("B395A96C-C7D3-4597-862B-8B717BBCC200", "加工单");
    }

    OpenPdf(name, label) {
        const { EntityData } = this.PageConfig;
        let url = "Order.aspx?Name=" + name + "&Id=" + EntityData.OrderId;
        url = Common.AddUrlRandom(url);

        if (url.toLowerCase().indexOf("http") !== 0) url = Common.DataApiUrl.replace("api/", "") + url;

        window.open(url);
    }
}