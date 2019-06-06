import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class RoleManage extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_RoleManage";
        this.MinActionType = 2700;
        this.MaxActionType = 2799;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("RoleService", "GetDataList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        this.DvaActions.Dispatch("RoleService", "Delete", { RoleId: primaryKey, Action: this.GetAction(id, actionType) });
    }

}