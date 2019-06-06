import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class PlatformRateConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_PlatformRateConfig";
        this.MinActionType = 2100;
        this.MaxActionType = 2199;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("PlatformRateService", "GetDataList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        this.DvaActions.Dispatch("PlatformRateService", "Delete", { PlatformRateId: primaryKey, Action: this.GetAction(id, actionType) });
    }
}