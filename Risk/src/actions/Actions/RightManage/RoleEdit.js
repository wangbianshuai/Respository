import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class RoleEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_RoleEdit";
        this.MinActionType = 3800;
        this.MaxActionType = 3899;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        Common2.GetEntityData.call(this, id, actionType, data, "Role", "RoleId", "roleId", "对不起，当前角色编辑数据不存在！");
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.roleId ? data.OldEntityData.roleId : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.roleId = primaryKey;

        this.DvaActions.Dispatch("RoleService", serviceName, { data: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}