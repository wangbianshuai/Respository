import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class FinalReviewAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FinalReviewAuditing";
        this.MinActionType = 1400;
        this.MaxActionType = 1499;

        this.Init();
    }

    //获取订单基本信息实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取终审授信结论信息
    GetFinalApprovalResult(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetFinalApprovalResult", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存审核意见
    SaveApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "SaveApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

}