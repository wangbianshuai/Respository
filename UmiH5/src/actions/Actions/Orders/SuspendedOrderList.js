import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class SuspendedOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_SuspendedOrderList";
        this.MinActionType = 500;
        this.MaxActionType = 599;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "QuerySuspendedOrderList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    UnHandUpOrder(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "UnHandUpOrder", { data: data, Action: this.GetAction(id, actionType) });
    }

}