import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

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
        this.DvaActions.Dispatch("OrderService", "GetExitOrderInfo", { ...data.EntityData, approvalType: "03", Action: this.GetAction(id, actionType) });
    }

    SetGetExitOrderInfo(id, actionType, data) {
        data = Common2.SetGetPatchExitOrderInfo.call(this, id, actionType, data);

        if (data.RefundOrder) return data.RefundOrder;

        return data;
    }

    //获取审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetIndeedApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    SaveApprovalOpinion(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = {
            ...EntityData,
            loanApplyId: PageData.OrderCode,
            taskId: PageData.TaskId,
            approvalResult: "01",
            Action: this.GetAction(id, actionType)
        };
        this.DvaActions.Dispatch("ApprovalService", "SaveIndeedApprovalOpinion", payload);
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }

    SetGetOrderStatus(id, actionType, data) {
        return Common2.SetGetOrderStatus.call(this, id, actionType, data);
    }
}