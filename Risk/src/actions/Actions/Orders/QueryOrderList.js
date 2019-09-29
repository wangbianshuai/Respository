import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import Common2 from "../Common2";
import { Common } from "UtilsCommon";

export default class QueryOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_QueryOrderList";
        this.MinActionType = 600;
        this.MaxActionType = 699;

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

        this.DvaActions.Dispatch("OrderService", "QueryOrderList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "workOrderList");
        if (data.DataList) Common2.SetOrderDataList(data.DataList);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }

    CancelOrder(id, actionType, data) {
        const { SelectRowKeys } = data;
        const payload = {
            loanApplyIdList: SelectRowKeys,
            Action: this.GetAction(id, actionType)
        }

        this.DvaActions.Dispatch("OrderService", "CancelOrder", payload);
    }

    ChangeUser(id, actionType, data) {
        const { OldEntityData, EntityData } = data;
        const payload = {
            loanApplyId: OldEntityData.loanApplyId,
            transformUserId: EntityData.ChangeApproveUser,
            Action: this.GetAction(id, actionType)
        }
        this.DvaActions.Dispatch("OrderService", "ChangeUser", payload);
    }
}