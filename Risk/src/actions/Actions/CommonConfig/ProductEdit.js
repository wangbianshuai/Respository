import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class ProductEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_ProductEdit";
        this.MinActionType = 3300;
        this.MaxActionType = 3399;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        Common2.GetEntityData.call(this, id, actionType, data, "Product", "ProductId", "productId", "对不起，当前产品配置辑数据不存在！");
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.productId ? data.OldEntityData.productId : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.productId = primaryKey;

        this.DvaActions.Dispatch("ProductService", serviceName, { data: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}