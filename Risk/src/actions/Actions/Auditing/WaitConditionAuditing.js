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

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取补件退单信息
    //"07", "终审等待签约条件"
    GetPatchRecordEntityData(id, actionType, data) {
        Common2.GetPatchExitOrderInfo.call(this, id, actionType, data, "07")
    }

    //获取补件退单信息
    SetGetPatchRecordEntityData(id, actionType, data) {
        data= Common2.SetGetPatchExitOrderInfo.call(this, id, actionType, data);
        if(data.PatchRecord) return data.PatchRecord;
        return data;
    }

    //获取审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetWaitConditionApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存审核意见
    SaveApprovalOpinion(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = {
            ...EntityData,
            loanApplyId: PageData.OrderCode,
            taskId: PageData.TaskId,
            Action: this.GetAction(id, actionType)
        };
        this.DvaActions.Dispatch("ApprovalService", "SaveWaitConditionApprovalOpinion", payload);
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }

    SetGetOrderStatus(id, actionType, data) {
        return Common2.SetGetOrderStatus.call(this, id, actionType, data);
    }
}