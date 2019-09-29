import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";
import { Common } from "UtilsCommon";
import EnumMap from "../EnumMap";

export default class OrderPatchEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CreditManage_OrderPatchEdit";
        this.MinActionType = 900;
        this.MaxActionType = 999;

        this.Init();
    }

    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    SavePatchInfoEntityData(id, actionType, data) {
        const { OldEntityData, EntityData, PageData } = data;
        const payload = {
            supplementId: OldEntityData.supplementId,
            receiverCommitRemark: EntityData.receiverCommitRemark,
            loanApplyId: PageData.OrderCode,
            taskId: PageData.TaskId,
            Action: this.GetAction(id, actionType)
        };
        this.DvaActions.Dispatch("OrderService", "SavePatchInfo", payload);
    }

    GetPatchInfoEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetPatchInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetPatchInfoEntityData(id, actionType, data) {
        data = this.SetApiResponse(data);

        //remainingTime (integer, optional): 补件剩余时间（以分钟为单位）
        if (!Common.IsNullOrEmpty(data.remainingTime)) {
            const ms = Common.GetIntValue(data.remainingTime);
            let days = Common.GetIntValue(ms / (60 * 24));
            let hours = Common.GetIntValue((ms - days * 60 * 24) / 60);
            let minutes = Common.GetIntValue(ms - days * 60 * 24 - hours * 60);
            let tip = "";
            if (days > 0) tip += days + "天";
            if (hours > 0) tip += hours + "小时";
            if (minutes > 0) tip += minutes + "分";
            data.MainTip = `重要提醒：剩余可操作时间还有${tip}，到期后补件超时则视为补件失败而被拒单`;
        }

        data.approvalResultName = EnumMap.GetApprovalReusltName(data.approvalResult)

        return data;
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }

    SetGetOrderStatus(id, actionType, data) {
        return Common2.SetGetOrderStatus.call(this, id, actionType, data);
    }
}