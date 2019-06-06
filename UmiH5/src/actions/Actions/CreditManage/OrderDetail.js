import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class OrderDetail extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CreditManage_OrderDetail";
        this.MinActionType = 800;
        this.MaxActionType = 899;

        this.Init();
    }

    GetAllIndustry(id, actionType, data){
        Common2.GetAllIndustry.call(this, id, actionType, data);
    }

    SetGetAllIndustry(id, actionType, data){
        return Common2.SetGetAllIndustry.call(this, id, actionType, data);
    }

    GetOrderDetailEntityData(id, actionType, data){
        Common2.GetOrderDetailEntityData.call(this, id, actionType, data);
    }

    SetGetOrderDetailEntityData(id, actionType, data){
        return Common2.SetGetOrderDetailEntityData.call(this, id, actionType, data);
    }

    SaveOrderDetailEntityData(id, actionType, data) {
        const { EntityData } = data;
        const payload = { Action: this.GetAction(id, actionType) };

        if (EntityData.ViewName === "PersonPropertyInfo") {
            for (let key in EntityData) { if (key !== "ViewName") payload[key] = EntityData[key]; }
        }
        else {
            const editData = { ...data.OldEntityData };
            for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }
            payload[EntityData.ViewName] = editData;
        }

        this.DvaActions.Dispatch("OrderService", "SaveOrderDetailEntityData", payload);
    }

    SubmitOrderInfo(id, actionType, data) {
        const payload = { Action: this.GetAction(id, actionType) };

        this.DvaActions.Dispatch("OrderService", "SubmitOrderInfo", payload);
    }

    GetOrderStatus(id, actionType, data){
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }
}