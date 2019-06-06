import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class ProductConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_ProductConfig";
        this.MinActionType = 2200;
        this.MaxActionType = 2299;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("ProductService", "GetDataList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }
}