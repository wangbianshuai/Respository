import ProcessOrderAttach from "../pagecomponents/ProcessOrderAttach";
import * as Common from "../utils/Common";

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
            this.AttachView = { Id: Common.CreateGuid(), Title: title, Width: 900, Visible: true, IsOk: false };
            this.AttachView.PageId = Common.CreateGuid();
            this.AttachView.Component = this.GetComponent(params.OrderId, 2);
            this.Page.SetModalDialog(this.AttachView);
        }
        else { this.AttachView.Title = title; this.Load(params.OrderId, 2); }
    }


    GetComponent(orderId, fileType) {
        return <ProcessOrderAttach PageId={this.AttachView.PageId} Property={this.AttachView} Page={this.Page} OrderId={orderId} FileType={fileType} />
    }

    Load(orderId, fileType) {
        this.AttachView.LoadData && this.AttachView.LoadData(orderId, fileType);
    }
}