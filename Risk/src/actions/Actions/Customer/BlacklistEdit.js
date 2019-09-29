import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class BlacklistEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_BlacklistEdit";
        this.MinActionType = 3500;
        this.MaxActionType = 3599;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        Common2.GetEntityData.call(this, id, actionType, data, "Blacklist", "BlacklistId", "blackId", "对不起，当前黑名单编辑数据不存在！");
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.blackId ? data.OldEntityData.blackId : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.blackId = primaryKey;

        this.DvaActions.Dispatch("BlacklistService", serviceName, { data: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}