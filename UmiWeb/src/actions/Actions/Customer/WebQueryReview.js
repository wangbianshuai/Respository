import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class WebQueryReview extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_WebQueryReview";
        this.MinActionType = 4200;
        this.MaxActionType = 4299;

        this.Init();
    }
    
    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("ApiService", "GetNetCheckList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    Review(id, actionType, data) {
        this.Dispatch(id, actionType, data)
    }
}