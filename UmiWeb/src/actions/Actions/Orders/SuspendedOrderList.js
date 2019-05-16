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

    GetStateActionTypes() {
        const { SearchQuery, UnHandUpOrder } = this.ActionTypes;

        return {
            DataList: [SearchQuery],
            UnHandUpOrder: [UnHandUpOrder]
        }
    }

    Invoke(id, actionType, data) {
        const { SearchQuery, UnHandUpOrder } = this.ActionTypes;

        switch (actionType) {
            case SearchQuery: this.SearchQuery(id, actionType, data); break;
            case UnHandUpOrder: this.UnHandUpOrder(id, actionType, data); break;
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

    UnHandUpOrder(id, actionType, data) {
        this.Dispatch(id, actionType, data)
    }

}