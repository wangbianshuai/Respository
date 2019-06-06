import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class OrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_OrderList";
        this.MinActionType = 100;
        this.MaxActionType = 199;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { OrderStatus, QueryName, Keyword } } = data;
        const payload = {
            workOrderState: OrderStatus,
            pageIndex: data.PageIndex,
            pageSize: data.PageSize,
            Action: this.GetAction(id, actionType)
        };

        payload[QueryName] = Keyword;

        this.DvaActions.Dispatch("OrderService", "QueryPoolOrder", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    DispatchOrder(id, actionType, data) {
        const { SelectRowKeys, SelectValues } = data;
        const payload = {
            loanApplyIdList: SelectRowKeys,
            userId: SelectValues[0],
            Action: this.GetAction(id, actionType)
        }
        this.DvaActions.Dispatch("OrderService", "DispatchOrder", payload);
    }

    GrabOrder(id, actionType, data) {
        const { SelectRowKeys } = data;
        const payload = {
            loanApplyIdList: SelectRowKeys,
            Action: this.GetAction(id, actionType)
        }
        this.DvaActions.Dispatch("OrderService", "GrabOrder", payload);
    }

}