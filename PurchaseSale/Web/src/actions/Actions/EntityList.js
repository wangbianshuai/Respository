import BaseIndex from "../BaseIndex";
import DataGriViewActionType from "../ActionTypes/Components/DataGridView";

export default class EntityList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { RequestList } = data;
        const payload = { Action: this.GetAction(id, actionType, false) };

        payload.RequestList = RequestList;

        this.DvaActions.Dispatch(this.ServiceName, "SearchQuery", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id, actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        const pathQuery = `(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "Delete", { PathQuery: pathQuery, Action: this.GetAction(id, actionType) });
    }

}