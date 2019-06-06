import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class QueryCustomer extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_QueryCustomer";
        this.MinActionType = 2500;
        this.MaxActionType = 2599;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("ApiService", "GetOrderList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

}