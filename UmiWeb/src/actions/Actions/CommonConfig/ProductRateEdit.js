import BaseIndex from "../../BaseIndex";

export default class ProductRateEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_ProductRateEdit";
        this.MinActionType = 3400;
        this.MaxActionType = 3499;

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
        this.DvaActions.Dispatch("ProductRateService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetEntityData(id, actionType, data) {

        return data;
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.ProductRateId ? data.OldEntityData.ProductRateId : null;

        data.EntityData.ProductNo = "00" + parseInt(Math.random() * 10000, 10);
        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.ProductRateId = primaryKey;

        this.DvaActions.Dispatch("ProductRateService", serviceName, { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

}