import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";
import { Common } from "UtilsCommon";

export default class IndeedAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_IndeedAuditing";
        this.MinActionType = 1700;
        this.MaxActionType = 1799;

        this.Init();
    }

    //获取实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取退单信息
    GetExitOrderInfo(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetExitOrderInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetExitOrderInfo(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (Common.IsArray(data.RefundOrder)) {
            data.RefundOrder.forEach(d => {
                d.Id = Common.CreateGuid();
                d.Title = "退单编号：" + d.RefundOrderCode;
            })
            return { RecordList: data.RefundOrder }
        }

        return data;
    }

    //获取审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetIndeedApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    SaveApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "SaveIndeedApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }
}