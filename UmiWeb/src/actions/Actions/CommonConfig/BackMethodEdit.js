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
        const primaryKey = data.OldEntityData && data.OldEntityData.BackMethodId ? data.OldEntityData.BackMethodId : null;

        data.EntityData.ProductNo = "00" + parseInt(Math.random() * 10000, 10);
        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.BackMethodId = primaryKey;

        this.DvaActions.Dispatch("BackMethodService", serviceName, { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }
}