import BaseIndex from "../../BaseIndex";

export default class RoleConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_RoleConfig";
        this.MinActionType = 3700;
        this.MaxActionType = 3799;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("UserService", "GetData", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.UserId ? data.OldEntityData.UserId : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.UserId = primaryKey;

        this.DvaActions.Dispatch("UserService", serviceName, { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }
}