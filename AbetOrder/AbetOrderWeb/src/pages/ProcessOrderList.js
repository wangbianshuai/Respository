import ProcessOrderAttach from "../pagecomponents/ProcessOrderAttach";

export default class ProcessOrderList {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.PageConfig.DataView.ExpandSetOperation = (actionList, record) => this.ExpandSetOperation(actionList, record);
    }

    ExpandSetOperation(actionList, record) {
        const lookAttach = [{ Name: "LookAttach", Text: "查看附件", ClickAction: this.LookAttach.bind(this) }];
        if (record.BillStatus === 1) return lookAttach;
        return lookAttach.concat(actionList);
    }

    LookAttach(property, params) {
        const title = "查看" + params.OrderCode + "附件";

        if (this.AttachView === undefined) {
            this.AttachView = { Title: title, Width: 900, Visible: true, IsOk: false };
            this.AttachView.Component = this.GetComponent(params.OrderId);
            this.Page.SetModalDialog(this.AttachView);
        }
        else this.Load(params.OrderId);
    }

    GetComponent(orderId) {
        return <ProcessOrderAttach Property={this.AttachView} Page={this.Page} OrderId={orderId} />
    }

    Load(orderId) {
        this.AttachView.LoadData && this.AttachView.LoadData(orderId);
    }
}