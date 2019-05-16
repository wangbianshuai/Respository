import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class ProductRateConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_ProductRateConfig";
        this.MinActionType = 2300;
        this.MaxActionType = 2399;

        this.Init();
    }

   
    GetStateActionTypes() {
        const { SearchQuery, DeleteEntityData } = this.ActionTypes;

        return {
            DataList: [SearchQuery],
            DeleteEntityData: [DeleteEntityData]
        }
    }

    Invoke(id, actionType, data) {
        const { SearchQuery, DeleteEntityData } = this.ActionTypes;

        switch (actionType) {
            case SearchQuery: this.SearchQuery(id, actionType, data); break;
            case DeleteEntityData: this.DeleteEntityData(id, actionType, data); break;
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
        this.DvaActions.Dispatch("ProductRateService", "GetDataList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        this.DvaActions.Dispatch("ProductRateService", "Delete", { ProductRateId: primaryKey, Action: this.GetAction(id, actionType) });
    }

}