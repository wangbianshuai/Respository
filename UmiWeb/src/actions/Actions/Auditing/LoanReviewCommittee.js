import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class LoanReviewCommittee extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_LoanReviewCommittee";
        this.MinActionType = 1800;
        this.MaxActionType = 1899;

        this.Init();
    }

    //获取实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取审核意见明细
    GetApprovalOpinionDetails(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetApprovalOpinionDetails", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetIndeedApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    SaveApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "SaveIndeedApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }
}