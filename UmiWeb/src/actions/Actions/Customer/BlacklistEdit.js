import BaseIndex from "../../BaseIndex";

export default class BlacklistEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_BlacklistEdit";
        this.MinActionType = 3500;
        this.MaxActionType = 3599;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("BlacklistService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.BlacklistId ? data.OldEntityData.BlacklistId : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.BlacklistId = primaryKey;

        this.DvaActions.Dispatch("BlacklistService", serviceName, { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }
}