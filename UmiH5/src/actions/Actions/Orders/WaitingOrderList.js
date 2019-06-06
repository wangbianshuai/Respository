import BaseIndex from "../../BaseIndex";
import { Common } from "UtilsCommon";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class WaitingOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_WaitingOrderList";
        this.MinActionType = 300;
        this.MaxActionType = 399;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "QueryWaitingOrderList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    //待审会处理订单
    HandlerOrder(id, actionType, data) {
        const { SelectData } = data;
        if (Common.IsEquals(SelectData.HandlerType, 0)) {
            const { ApproveUserList } = SelectData;
            if (!(ApproveUserList && ApproveUserList.length >= 3 && ApproveUserList.length % 2 === 1)) {
                this.Dispatch(id, actionType, { IsSuccess: false, Message: "请选择审批成员，且成员数为奇数，且至少邀请3个人" })
                return;
            }
        }

        this.DvaActions.Dispatch("OrderService", "CommitteeHandlerOrder", { data: data, Action: this.GetAction(id, actionType) });
    }

    //挂起
    HandUpOrder(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "HandUpOrder", { data: data, Action: this.GetAction(id, actionType) });
    }

}