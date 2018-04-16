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

        if (record.OrderStatus === 2 || record.CreateUser !== this.Page.LoginUser.UserId) {
            actionList = [billAction]
            actionList.push({ Name: "Look", Text: "查看", ActionType: "EntityEdit", ActionName: "Look", EditPageUrl: "/OrderEdit" })
            return actionList;
        }
        else if (record.OrderStatus === 0) {
            let list = [billAction]
            list.push({ Name: "UpdateStatus1", Text: "加工", Title: "确定要提交加工吗？", StatusName: "OrderStatus", StatusValue: 1, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            list = list.concat(actionList);
            return list;
        }
        else if (record.OrderStatus === 1) {
            let list = [billAction]
            list.push({ Name: "UpdateStatus2", Text: "存档", Title: "确定要存档完成吗？", StatusName: "OrderStatus", StatusValue: 2, IsConfrim: true, ActionType: "EntityEdit", ActionName: "UpdateStatus" });
            list.push({ Name: "UpdateAmount", Text: "收款", ActionType: "EntityEdit", ActionName: "Edit" })
            list.push(actionList[0])
            return list;
        }


        return actionList
    }
}