import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";
import { Common } from "UtilsCommon";

export default class RoleConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_RoleConfig";
        this.MinActionType = 3700;
        this.MaxActionType = 3799;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("UserService", "GetRoleConfig", { queryUserId: data.EntityData.userId, Action: this.GetAction(id, actionType) });
    }

    SetGetEntityData(id, actionType, data) {
        if (!this.Receives[id]) return false;
        
        data = this.SetApiResponse(data);
        if (data.IsSuccess === false) return data;

        const { UserId } = Common.GetQueryString();

        const editData2 = Common2.GetEntityData2({ EntityData: { UserId } }, "User", "UserId", "userId", "该用户编辑数据不存在！");
        if (editData2.IsSuccess === false) return editData2;

        for (var key in editData2) data[key] = editData2[key];

        if (data.roleList) data.Roles = data.roleList.map(m => m.roleId);

        return data;
    }

    SaveEntityData(id, actionType, data) {
        const { EntityData } = data;
        const primaryKey = data.OldEntityData && data.OldEntityData.userId ? data.OldEntityData.userId : null;
        const payload = {
            configUserId: primaryKey,
            roleIdList: EntityData.Roles,
            Action: this.GetAction(id, actionType)
        };
        
        this.DvaActions.Dispatch("UserService", "SaveRoleConfig", payload);
    }
}