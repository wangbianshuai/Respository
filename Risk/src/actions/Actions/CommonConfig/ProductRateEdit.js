import BaseIndex from "../../BaseIndex";

export default class ProductRateEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_ProductRateEdit";
        this.MinActionType = 3400;
        this.MaxActionType = 3499;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("ProductRateService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.interestRateId ? data.OldEntityData.interestRateId : null;

        const serviceName = primaryKey ? "Update" : "Insert";
        
        if (primaryKey) data.EntityData.interestRateId = primaryKey;

        this.DvaActions.Dispatch("ProductRateService", serviceName, { data: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}