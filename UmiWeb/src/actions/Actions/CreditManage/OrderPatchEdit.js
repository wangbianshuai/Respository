import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

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
        this.DvaActions.Dispatch("OrderService", "SavePatchInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    GetPatchInfoEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetPatchInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    GetOrderStatus(id, actionType, data){
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }
}