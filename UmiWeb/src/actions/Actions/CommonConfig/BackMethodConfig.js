import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class BackMethodConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_BackMethodConfig";
        this.MinActionType = 2000;
        this.MaxActionType = 2099;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("BackMethodService", "GetDataList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        this.DvaActions.Dispatch("BackMethodService", "Delete", { BackMethodId: primaryKey, Action: this.GetAction(id, actionType) });
    }
}