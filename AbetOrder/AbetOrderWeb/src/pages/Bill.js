export default class Bill {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.PageConfig.DataView.ExpandSetOperation = (actionList, record) => this.ExpandSetOperation(actionList, record);

        this.PageConfig.DataView.ExpandedRowRender = (record) => this.ExpandedRowRender(record);
    }

    ExpandSetOperation(actionList, record) {
        if (actionList.length === 1 && record.BillStatus === 0) {
            const list = []
            list.push({ Name: "Approve", Text: "审核", Title: "确定要审核通过吗？", StatusName: "BillStatus", StatusValue: 1, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            list.push(actionList[0])
            return list;
        }
        else if (record.BillStatus === 1) {
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