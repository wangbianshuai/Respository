import BaseIndex from "../../BaseIndex";

export default class BackMethodEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_BackMethodEdit";
        this.MinActionType = 2900;
        this.MaxActionType = 2999;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("BackMethodService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.repaymentConfigId ? data.OldEntityData.repaymentConfigId : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.repaymentConfigId = primaryKey;

        this.DvaActions.Dispatch("BackMethodService", serviceName, { data: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}