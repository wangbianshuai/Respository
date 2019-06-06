import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class BlacklistManage extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_BlacklistManage";
        this.MinActionType = 2400;
        this.MaxActionType = 2499;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("BlacklistService", "GetDataList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const blacklistId = data.SelectRowKeys[0];
        this.DvaActions.Dispatch("BlacklistService", "Delete", { BlacklistId: blacklistId, Action: this.GetAction(id, actionType) });
    }

}