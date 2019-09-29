import BaseIndex from "../../BaseIndex";

export default class PlatformManageRateEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_PlatformManageRateEdit";
        this.MinActionType = 3100;
        this.MaxActionType = 3199;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("PlatformRateService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.feeTemplateId ? data.OldEntityData.feeTemplateId : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        data.EntityData.feeType = "01";
        if (primaryKey) data.EntityData.feeTemplateId = primaryKey;

        this.DvaActions.Dispatch("PlatformRateService", serviceName, { data: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}