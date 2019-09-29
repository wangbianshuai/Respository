import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import Common2 from "../Common2";
import { Common } from "UtilsCommon";

export default class OrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_OrderList";
        this.MinActionType = 100;
        this.MaxActionType = 199;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { OrderStatus, QueryName, Keyword }, PageData } = data;
        const payload = { Action: this.GetAction(id, actionType) };

        if (!PageData.IsSearchQuery) {
            PageData.IsSearchQuery = true;
            const RequestList = [];

            /*  03	待初审  07	待实地   09	待终审*/
            RequestList.push({ Url: "workOrder/pool/queryWorkOrder", Data: { workOrderState: "03", pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize } } });
            RequestList.push({ Url: "workOrder/pool/queryWorkOrder", Data: { workOrderState: "07", pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize } } });
            RequestList.push({ Url: "workOrder/pool/queryWorkOrder", Data: { workOrderState: "09", pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize } } });

            //查询用户拥有的角色
            RequestList.push({ Url: "useraccess/role/queryRolesByUser", Data: { queryUserId: Common.GetStorage("LoginUserId") } });

            payload.RequestList = RequestList;
        }
        else {
            payload.workOrderState = OrderStatus;
            payload.pageRequest = { pageNum: data.PageIndex, pageSize: data.PageSize };
            payload[QueryName] = Keyword;
        }

        this.DvaActions.Dispatch("OrderService", "QueryPoolOrder", payload);
    }

    /*业务规则：
    1、用户角色：初审审核（待初审）、实地（待实地）、终审审核（待终审）
    2、根据以上三个用户角色进行判断，后显示对应菜单
    3、其他用户角色不做限制，可以显示三种状态的列表
    4、状态栏显示当前工单数量*/
    SetSearchQuery(id, actionType, data) {
        if (Common.IsArray(data.Data)) {
            const res3 = data.Data[0];
            const res7 = data.Data[1];
            const res9 = data.Data[2];

            const len3 = res3.pageResponse ? res3.pageResponse.total : 0;
            const len7 = res7.pageResponse ? res7.pageResponse.total : 0;
            const len9 = res9.pageResponse ? res9.pageResponse.total : 0;

            const roleList = data.Data[3].roleList;
            var statusList = [];

            const status3 = { Value: "03", Text: `待初审(${len3})` };
            const status7 = { Value: "07", Text: `待实地(${len7})` };
            const status9 = { Value: "09", Text: `待终审(${len9})` };

            let isStatus3 = false, isStatus7 = false, isStatus9 = false;

            roleList && roleList.forEach(r => {
                if (r.roleName === "初审审核") isStatus3 = true;
                if (r.roleName === "实地") isStatus7 = true;
                if (r.roleName === "终审审核") isStatus9 = true;
            });

            if (isStatus3) statusList.push(status3);
            if (isStatus7) statusList.push(status7);
            if (isStatus9) statusList.push(status9);

            if (isStatus3) data.Data = res3;
            else if (isStatus7) data.Data = res7;
            else if (isStatus9) data.Data = res9;
            else { data.Data = res3; statusList = [status3, status7, status9]; }

            data = this.SetSearchQueryResponse(data, "workOrderList");
            data.StatusList = statusList;
        }
        else data = this.SetSearchQueryResponse(data, "workOrderList");
        if (data.DataList) Common2.SetOrderDataList(data.DataList);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id, actionType, data);
        return false;
    }

    DispatchOrder(id, actionType, data) {
        const { SelectRowKeys, SelectValues } = data;
        const payload = {
            loanApplyId: SelectRowKeys[0],
            deliveryUserId: SelectValues[0],
            Action: this.GetAction(id, actionType)
        }
        this.DvaActions.Dispatch("OrderService", "DispatchOrder", payload);
    }

    GrabOrder(id, actionType, data) {
        const { SelectRowKeys, EntityData } = data;
        const payload = {
            loanApplyId: SelectRowKeys.length > 0 ? SelectRowKeys[0] : "",
            Action: this.GetAction(id, actionType)
        }
        //不选中工单时进行抢单，状态03待初审，07待实地，09待终审
        if (SelectRowKeys.length === 0) payload.status = EntityData.OrderStatus;

        this.DvaActions.Dispatch("OrderService", "GrabOrder", payload);
    }

}