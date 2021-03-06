import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class ApplicationList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "ConfigManage_ApplicationList";
        this.MinActionType = 100;
        this.MaxActionType = 199;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { RequestList } = data;
        const payload = { Action: this.GetAction(id, actionType) };

        payload.RequestList = RequestList;

        this.DvaActions.Dispatch("ApplicationService", "SearchQuery", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "Application");
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id, actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        const pathQuery = `(${primaryKey})`;
        this.DvaActions.Dispatch("ApplicationService", "Delete", { PathQuery: pathQuery, Action: this.GetAction(id, actionType) });
    }

}