import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import Common2 from "../Common2";

export default class HandledOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_HandledOrderList";
        this.MinActionType = 400;
        this.MaxActionType = 499;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { QueryName, Keyword } } = data;
        const payload = {
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            Action: this.GetAction(id, actionType)
        };

        payload[QueryName] = Keyword;

        this.DvaActions.Dispatch("OrderService", "QueryHandledOrderList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "workOrderList");
        if (data.DataList) Common2.SetOrderDataList(data.DataList);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }
}