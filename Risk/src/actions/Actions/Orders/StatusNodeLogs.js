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

    SearchQuery(id, actionType, data) {
        const { PageData } = data;
        const payload = {
            loanApplyId: PageData.LogOrderCode,
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            Action: this.GetAction(id, actionType)
        };

        this.DvaActions.Dispatch("OrderService", "GetOrderStatusLogs", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "workProcessLogList");
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }
}