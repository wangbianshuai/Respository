import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class WaitConditionAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_WaitConditionAuditing";
        this.MinActionType = 1900;
        this.MaxActionType = 1999;

        this.Init();
    }

    //获取实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取补件信息
    GetPatchRecordInfo(id, actionType, data) {
        this.DvaActions.Dispatch("PatchService", "GetPatchRecordInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
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