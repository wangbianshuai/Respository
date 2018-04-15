import * as Common from "../utils/Common";

export default class DealingsBill {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.PageConfig.DataView.ExpandSetOperation = (actionList, record) => this.ExpandSetOperation(actionList, record);

        this.PageConfig.DataView.ExpandedRowRender = (record) => this.ExpandedRowRender(record);

        this.PageConfig.EditView.ExpandSetEditData = (data) => this.ExpandSetEditData(data);

        this.PageConfig.EditView.Properties.forEach(p => {
            if (p.Name === "DealingsUser") this.DealingsUserProperty = p;
        });
    }

    ExpandSetEditData(data) {
        if (data.DealingsUser === this.Page.LoginUser.UserId) {
            this.Page.ShowMessage("业务往来人不能为自己！")
            return false;
        }

        const dealingsUser = {
            CreateUser: this.Page.LoginUser.UserId,
            DealingsUser: data.DealingsUser,
            DealingsUserName: this.DealingsUserProperty.GetText()
        }

        this.PageConfig.AddTabPane && this.PageConfig.AddTabPane(dealingsUser);

        return data
    }


    ExpandSetOperation(actionList, record) {
        if (actionList.length === 1 && record.BillStatus === 0 && record.IncomePayment === 1) {
            const list = []
            list.push({ Name: "Approve", Text: "审核", Title: "确定要审核通过吗？", StatusName: "BillStatus", StatusValue: 1, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            list.push(actionList[0])
            return list;
        }
        else if (record.BillStatus === 1 || !Common.IsNullOrEmpty(record.DataId)) {
            actionList = []
            actionList.push({ Name: "Look", Text: "查看", ActionType: "EntityEdit", ActionName: "Look" })
            return actionList;
        }

        return actionList
    }

    ExpandedRowRender(record) {
        return record.Remark;
    }
}