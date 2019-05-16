import BaseIndex from "../../BaseIndex";

export default class BackMethodConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_BackMethodConfig";
        this.MinActionType = 2000;
        this.MaxActionType = 2099;

        this.Init();
    }

    GetStateActionTypes() {
        const { GetEntityData } = this.ActionTypes;

        return {
            EntityData: [GetEntityData]
        }
    }

    Invoke(id, actionType, data) {
        const { GetEntityData } = this.ActionTypes;

        switch (actionType) {
            case GetEntityData: this.GetEntityData(id, actionType, data); break;
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

    }

    SetGetEntityData(id, actionType, data) {

    }

}