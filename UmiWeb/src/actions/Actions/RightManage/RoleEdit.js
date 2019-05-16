import BaseIndex from "../../BaseIndex";

export default class RoleEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_RoleEdit";
        this.MinActionType = 3800;
        this.MaxActionType = 3899;

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