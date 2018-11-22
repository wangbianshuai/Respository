export default class DealingsBillType {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.PageConfig.DataView.ExpandSetOperation = (actionList, record) => this.ExpandSetOperation(actionList, record);
    }

    ExpandSetOperation(actionList, record) {
        if (record.Name === "订单加工费") {
            actionList = []
            actionList.push({ Name: "Look", Text: "查看", ActionType: "EntityEdit", ActionName: "Look" })
            return actionList;
        }

        return actionList
    }
}