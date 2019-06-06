import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class UserEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_UserEdit";
        this.MinActionType = 3900;
        this.MaxActionType = 3999;

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

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("ApiService", "GetUserList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }
}