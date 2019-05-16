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

    GetStateActionTypes() {
        const { SearchQuery, HandlerOrder, HandUpOrder } = this.ActionTypes;

        return {
            DataList: [SearchQuery],
            HandlerOrder: [HandlerOrder],
            HandUpOrder: [HandUpOrder]
        }
    }

    Invoke(id, actionType, data) {
        const { SearchQuery, HandlerOrder, HandUpOrder } = this.ActionTypes;

        switch (actionType) {
            case SearchQuery: this.SearchQuery(id, actionType, data); break;
            case HandlerOrder: this.HandlerOrder(id, actionType, data); break;
            case HandUpOrder: this.HandUpOrder(id, actionType, data); break;
            default: this.Dispatch(id, actionType, data); break;
        }
    }

    SetResponseData(id, actionType, data) {
        const { SearchQuery } = this.ActionTypes;

        switch (actionType) {
            case SearchQuery: return this.SetSearchQuery(id, actionType, data);
            default: return this.SetApiResponse(data);
        }
    }

    SearchQuery(id, actionType, data) {
        this.DvaActions.Dispatch("ApiService", "GetOrderList", { data: data, Action: this.GetAction(id, actionType) });
    }

    SetSearchQuery(id, actionType, data) {
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(actionType, data);
        return false;
    }

    HandlerOrder(id, actionType, data) {
        const { SelectData } = data;
        if (Common.IsEquals(SelectData.HandlerType, 0)) {
            const { ApproveUserList } = SelectData;
            if (!(ApproveUserList && ApproveUserList.length >= 3 && ApproveUserList.length % 2 === 1)) {
                this.Dispatch(id, actionType, { IsSuccess: false, Message: "请选择审批成员，且成员数为奇数，且至少邀请3个人" })
                return;
            }
        }

        this.Dispatch(id, actionType, data)
    }

    HandUpOrder(id, actionType, data) {
        this.Dispatch(id, actionType, data)
    }

}