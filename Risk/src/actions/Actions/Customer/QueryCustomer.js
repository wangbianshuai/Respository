import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import Common2 from "../Common2";
import { Common } from "UtilsCommon";

export default class QueryCustomer extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_QueryCustomer";
        this.MinActionType = 2500;
        this.MaxActionType = 2599;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { QueryName, Keyword } } = data;
        const payload = {
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            Action: this.GetAction(id, actionType)
        };

        payload[QueryName] = Keyword;

        if (Common.IsNullOrEmpty(Keyword)) { this.Dispatch(id, actionType, { IsSuccess: false, Message: "请选择查询条件执行获取数据！" }); return }

        this.DvaActions.Dispatch("OrderService", "QueryCustomerOrderList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "workOrderList");
        if (data.DataList) Common2.SetOrderDataList(data.DataList);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }

}