import BaseIndex from "../../BaseIndex";

export default class BlacklistEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_BlacklistEdit";
        this.MinActionType = 3500;
        this.MaxActionType = 3599;

        this.Init();
    }

    GetStateActionTypes() {
        const { GetEntityData, SaveEntityData } = this.ActionTypes;

        return {
            EntityData: [GetEntityData],
            SaveEntityData: [SaveEntityData]
        }
    }

    Invoke(id, actionType, data) {
        const { GetEntityData, SaveEntityData } = this.ActionTypes;

        switch (actionType) {
            case GetEntityData: this.GetEntityData(id, actionType, data); break;
            case SaveEntityData: this.SaveEntityData(id, actionType, data); break;
            default: this.Dispatch(id, actionType, data); break;
        }
    }

    SetResponseData(id, actionType, data) {
        const { GetEntityData } = this.ActionTypes;

        switch (actionType) {
            case GetEntityData: return this.SetGetEntityData(id, actionType, data);
            default: return this.SetApiResponse(data);
        }
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("BlacklistService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetEntityData(id, actionType, data) {

        return data;
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.BlacklistId ? data.OldEntityData.BlacklistId : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.BlacklistId = primaryKey;

        this.DvaActions.Dispatch("BlacklistService", serviceName, { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }
}