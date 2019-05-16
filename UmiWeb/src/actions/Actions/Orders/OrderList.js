import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class OrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_OrderList";
        this.MinActionType = 100;
        this.MaxActionType = 199;

        this.Init();
    }

    GetStateActionTypes() {
        const { SearchQuery, DispatchOrder, GrabOrder } = this.ActionTypes;

        return {
            DataList: [SearchQuery],
            DispatchOrder: [DispatchOrder],
            GrabOrder: [GrabOrder]
        }
    }

    Invoke(id, actionType, data) {
        const { SearchQuery, DispatchOrder, GrabOrder } = this.ActionTypes;

        switch (actionType) {
            case SearchQuery: this.SearchQuery(id, actionType, data); break;
            case DispatchOrder: this.DispatchOrder(id, actionType, data); break;
            case GrabOrder: this.GrabOrder(id, actionType, data); break;
            default: this.Dispatch(id, actionType, data); break;
        }
    }

    SetResponseData(id, actionType, data) {
        const { SearchQuery } = this.ActionTypes;

        switch (actionType) {
            case SearchQuery: return this.SetSearchQuery(id, actionType, data);
            default: return this.SetApiResponse(data);
        }
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("ApiService", "GetOrderList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    DispatchOrder(id, actionType, data) {
        this.Dispatch(id, actionType, data)
    }

    GrabOrder(id, actionType, data) {
        this.Dispatch(id, actionType, data)
    }

}