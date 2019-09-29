import BaseIndex from "../../BaseIndex";

export default class PlatformServiceRateEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_PlatformServiceRateEdit";
        this.MinActionType = 3200;
        this.MaxActionType = 3299;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("PlatformRateService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.feeTemplateId ? data.OldEntityData.feeTemplateId : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        data.EntityData.feeType = "02";
        if (primaryKey) data.EntityData.feeTemplateId = primaryKey;

        this.DvaActions.Dispatch("PlatformRateService", serviceName, { data: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}