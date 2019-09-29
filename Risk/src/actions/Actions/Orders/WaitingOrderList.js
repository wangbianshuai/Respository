import BaseIndex from "../../BaseIndex";
import { Common } from "UtilsCommon";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import Common2 from "../Common2";

export default class WaitingOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_WaitingOrderList";
        this.MinActionType = 300;
        this.MaxActionType = 399;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { QueryName, Keyword } } = data;
        const payload = {
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            Action: this.GetAction(id, actionType)
        };

        payload[QueryName] = Keyword;

        this.DvaActions.Dispatch("OrderService", "QueryWaitingOrderList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "workOrderList");
        if (data.DataList) Common2.SetOrderDataList(data.DataList);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }

    //待审会处理订单
    HandlerOrder(id, actionType, data) {
        const { SelectData, RowDataList } = data;
        var userIdList = [];
        //01 贷审会背靠背审核  02 贷审会集体审核
        let ruleType = "02"
        if (Common.IsEquals(SelectData.HandlerType, 0)) {
            const { ApproveUserList } = SelectData;
            if (!(ApproveUserList && ApproveUserList.length >= 3 && ApproveUserList.length % 2 === 1)) {
                this.Dispatch(id, actionType, { IsSuccess: false, Message: "请选择审批成员，且成员数为奇数，且至少邀请3个人" })
                return;
            }

            ruleType = "01";
            userIdList = ApproveUserList.map(m => m.UserId);
        }

        const rowData = RowDataList[0];

        const payload = {
            Action: this.GetAction(id, actionType),
            loanApplyId: rowData.loanApplyId,
            ruleType: ruleType,
            taskId: rowData.taskList && rowData.taskList.length > 0 ? rowData.taskList[0].taskId : ""
        }

        if (ruleType === "01") payload.backToBackconferenceUserList = userIdList;

        this.DvaActions.Dispatch("OrderService", "CommitteeHandlerOrder", payload);
    }

    //挂起
    HandUpOrder(id, actionType, data) {
        const { SelectRowKeys } = data;
        const payload = {
            loanApplyId: SelectRowKeys[0],
            Action: this.GetAction(id, actionType)
        }

        this.DvaActions.Dispatch("OrderService", "HandUpOrder", payload);
    }

}