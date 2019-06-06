import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class ApproveResultConfirm extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CreditManage_ApproveResultConfirm";
        this.MinActionType = 1100;
        this.MaxActionType = 1199;

        this.Init();
    }

    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    SaveApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "SaveApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    GetFinalApprovalResult(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetFinalApprovalResult", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    GetOrderStatus(id, actionType, data){
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }
}