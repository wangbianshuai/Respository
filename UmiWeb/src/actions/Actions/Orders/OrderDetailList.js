import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class OrderDetailList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_OrderDetailList";
        this.MinActionType = 4100;
        this.MaxActionType = 4199;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "QueryOrderDetailList", { data: data, Action:  this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }
}