import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import Common2 from "../Common2";

export default class OrderDetailList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_OrderDetailList";
        this.MinActionType = 4100;
        this.MaxActionType = 4199;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { QueryName, Keyword } } = data;
        const payload = {
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            Action: this.GetAction(id, actionType)
        };

        payload[QueryName] = Keyword;

        this.DvaActions.Dispatch("OrderService", "QueryOrderDetailList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "loanApplyList");
        if (data.DataList) Common2.SetOrderDataList(data.DataList);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }
}