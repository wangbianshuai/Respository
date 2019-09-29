import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import EnumMap from "../EnumMap";

export default class QueryBidOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_QueryBidOrderList";
        this.MinActionType = 4300;
        this.MaxActionType = 4399;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { OrderStatus, QueryName, Keyword } } = data;
        const payload = {
            pageIndex: data.PageIndex,
            pageSize: data.PageSize,
            Action: this.GetAction(id, actionType)
        };

        if (OrderStatus !== "00") payload.bidIssueResult = OrderStatus;

        payload[QueryName] = Keyword;

        this.DvaActions.Dispatch("OrderService", "QueryBidOrderList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "bidIssueList");
        if (data.DataList) {
            data.DataList.forEach(d => {
                d.bidIssueResultName = EnumMap.GetBidIssueResultName(d.bidIssueResult);
                d.loanUser = `${d.loanSellerName}（${d.loanSellerDepartment}）`;
                const productCategoryName = EnumMap.GetProductCategoryName(d.productCategory);
                d.productType = `${productCategoryName}/${d.productShortName}`;
                d.taskId = "";
                d.taskAssigneeId = "";
                d.IsCheckedDisabled = d.bidIssueResult === "01";
            });
        }
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }

    Bidding(id, actionType, data) {
        const { SelectRowKeys } = data;
        const payload = {
            loanApplyId: SelectRowKeys[0],
            Action: this.GetAction(id, actionType)
        }
        this.DvaActions.Dispatch("OrderService", "Bidding", payload);
    }
}