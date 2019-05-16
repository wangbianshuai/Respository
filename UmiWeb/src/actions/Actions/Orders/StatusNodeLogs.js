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

    GetStateActionTypes() {
        const { SearchQuery } = this.ActionTypes;

        return {
            DataList: [SearchQuery]
        }
    }

    Invoke(id, actionType, data) {
        const { SearchQuery } = this.ActionTypes;

        switch (actionType) {
            case SearchQuery: this.SearchQuery(id, actionType, data); break;
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
        this.DvaActions.Dispatch("ApiService", "GetOrderStatusLogs", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }
}