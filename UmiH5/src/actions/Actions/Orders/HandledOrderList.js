import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class HandledOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_HandledOrderList";
        this.MinActionType = 400;
        this.MaxActionType = 499;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "QueryHandledOrderList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }
}