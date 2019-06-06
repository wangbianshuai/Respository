import BaseIndex from "../../BaseIndex";

export default class PlatformFineRateEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_PlatformFineRateEdit";
        this.MinActionType = 3000;
        this.MaxActionType = 3099;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("PlatformRateService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.PlatformRateId ? data.OldEntityData.PlatformRateId : null;

        data.EntityData.ProductNo = "00" + parseInt(Math.random() * 10000, 10);
        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.PlatformRateId = primaryKey;

        this.DvaActions.Dispatch("PlatformRateService", serviceName, { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

}