import BaseIndex from "../../BaseIndex";
import { Common } from "UtilsCommon";

export default class RightConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_RightConfig";
        this.MinActionType = 3600;
        this.MaxActionType = 3699;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("RoleService", "GetRightConfig", { roleId: data.EntityData.roleId, Action: this.GetAction(id, actionType) });
    }

    SetGetEntityData(id, actionType, data) {
        data = this.SetApiResponse(data);
        const queryString = Common.GetQueryString();
        data.roleName = queryString.RoleName;
        return data;
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.roleId ? data.OldEntityData.roleId : null;
        data.EntityData.roleId = primaryKey;

        this.DvaActions.Dispatch("RoleService", "UpdateRightConfig", { data: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}