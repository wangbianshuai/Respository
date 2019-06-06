import BaseIndex from "../../BaseIndex";

export default class RoleEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_RoleEdit";
        this.MinActionType = 3800;
        this.MaxActionType = 3899;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("RoleService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.RoleId ? data.OldEntityData.RoleId : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.RoleId = primaryKey;

        this.DvaActions.Dispatch("RoleService", serviceName, { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }
}