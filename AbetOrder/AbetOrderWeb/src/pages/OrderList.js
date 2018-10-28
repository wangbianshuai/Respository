import ProcessOrderAttach from "../pagecomponents/ProcessOrderAttach";
import * as Common from "../utils/Common";

export default class OrderList {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.PageConfig.DataView.ExpandSetOperation = (actionList, record) => this.ExpandSetOperation(actionList, record);
    }

    ExpandSetOperation(actionList, record) {
        const billAction = { Name: "OrderBill", Text: "收支", IsToPage: true, PropertyNames: ["OrderCode", "OrderId"], PageUrl: "/Bill?OrderName2={OrderCode}&OrderId={OrderId}" };
        const lookAttach = { Name: "LookAttach", Text: "附件", ClickAction: this.LookAttach.bind(this) };

        if (record.OrderStatus === 2 || record.CreateUser !== this.Page.LoginUser.UserId) {
            actionList = [billAction, lookAttach]
            actionList.push({ Name: "Look", Text: "查看", ActionType: "EntityEdit", ActionName: "Look", EditPageUrl: "/OrderEdit" })
            return actionList;
        }
        else if (record.OrderStatus === 0) {
            let list = [billAction, lookAttach]
            list.push({ Name: "UpdateStatus1", Text: "加工", Title: "确定要提交加工吗？", StatusName: "OrderStatus", StatusValue: 1, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            list = list.concat(actionList);
            return list;
        }
        else if (record.OrderStatus === 1) {
            let list = [billAction, lookAttach]
            list.push({ Name: "UpdateStatus2", Text: "存档", Title: "确定要存档完成吗？", StatusName: "OrderStatus", StatusValue: 2, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            list.push({ Name: "UpdateAmount", Text: "收款", ActionType: "EntityEdit", ActionName: "Edit" })
            list.push(actionList[0])
            return list;
        }


        return actionList
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