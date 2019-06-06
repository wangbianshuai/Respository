import BaseIndex from "../../BaseIndex";

export default class ProductEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_ProductEdit";
        this.MinActionType = 3300;
        this.MaxActionType = 3399;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("ProductService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.ProductId ? data.OldEntityData.ProductId : null;

        data.EntityData.ProductNo = "00" + parseInt(Math.random() * 10000, 10);
        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.ProductId = primaryKey;

        this.DvaActions.Dispatch("ProductService", serviceName, { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }
}