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
        if (record.BillStatus === 1) return [];
        return actionList;
    }
}