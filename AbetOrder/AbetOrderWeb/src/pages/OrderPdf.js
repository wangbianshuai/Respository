export default class OrderPdf {
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
        if (actionList.length === 1 && record.FailId === 1 && record.GenStatus === 2) {
            const list = []
            list.push({ Name: "ReGenPdf", Text: "重新生成", Title: "确定要重新生成PDF吗？", StatusName: "GenStatus", StatusValue: 0, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            return list;
        }

        return []
    }

    ExpandedRowRender(record) {
        return record.FailMessage;
    }
}