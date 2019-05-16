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

    GetStateActionTypes() {
        const { SearchQuery, CancelOrder, ChangeUser } = this.ActionTypes;

        return {
            DataList: [SearchQuery],
            CancelOrder: [CancelOrder],
            ChangeUser: [ChangeUser]
        }
    }

    Invoke(id, actionType, data) {
        const { SearchQuery, CancelOrder, ChangeUser } = this.ActionTypes;

        switch (actionType) {
            case SearchQuery: this.SearchQuery(id, actionType, data); break;
            case CancelOrder: this.CancelOrder(id, actionType, data); break;
            case ChangeUser: this.ChangeUser(id, actionType, data); break;
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
        this.DvaActions.Dispatch("ApiService", "GetOrderList", { data: data, Action:  this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    CancelOrder(id, actionType, data) {
        this.Dispatch(id, actionType, data)
    }

    ChangeUser(id, actionType, data) {
        this.Dispatch(id, actionType, data)
    }
}