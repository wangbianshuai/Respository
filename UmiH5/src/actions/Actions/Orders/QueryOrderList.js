import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class QueryOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_QueryOrderList";
        this.MinActionType = 600;
        this.MaxActionType = 699;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "QueryOrderList", { data: data, Action:  this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    CancelOrder(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "CancelOrder", { data: data, Action:  this.GetAction(id, actionType) });
    }

    ChangeUser(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "ChangeUser", { data: data, Action:  this.GetAction(id, actionType) });
    }
}