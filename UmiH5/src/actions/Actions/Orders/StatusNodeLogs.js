import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class StatusNodeLogs extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_StatusNodeLogs";
        this.MinActionType = 700;
        this.MaxActionType = 799;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetOrderStatusLogs", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }
}