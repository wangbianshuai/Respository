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
        const billAction = { Name: "OrderBill", Text: "收支明细", IsToPage: true, PropertyNames: ["OrderCode", "OrderId"], PageUrl: "/Bill?OrderName2={OrderCode}&OrderId={OrderId}" };

        if (record.OrderStatus === 0) {
            let list = [billAction]
            list.push({ Name: "UpdateStatus1", Text: "提交加工", Title: "确定要提交加工吗？", StatusName: "OrderStatus", StatusValue: 1, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            list = list.concat(actionList);
            return list;
        }
        else if (record.OrderStatus === 1) {
            let list = [billAction]
            list.push({ Name: "UpdateStatus2", Text: "存档完成", Title: "确定要存档完成吗？", StatusName: "OrderStatus", StatusValue: 2, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            list.push(actionList[0])
            return list;
        }
        else if (record.OrderStatus === 2) {
            actionList = [billAction]
            actionList.push({ Name: "Look", Text: "查看", ActionType: "EntityEdit", ActionName: "Look", EditPageUrl: "/OrderEdit" })
            return actionList;
        }

        return actionList
    }
}