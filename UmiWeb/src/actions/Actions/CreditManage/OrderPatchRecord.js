import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class OrderPatchRecord extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CreditManage_OrderPatchRecord";
        this.MinActionType = 1000;
        this.MaxActionType = 1099;

        this.Init();
    }

    GetOrderInfoEntityData(id, actionType, data){
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data); 
    }

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    GetPatchRecordEntityData(id, actionType, data){
        Common2.GetPatchRecordEntityData.call(this, id, actionType, data);
    }

    SetGetPatchRecordEntityData(id, actionType, data){
        return Common2.SetGetPatchRecordEntityData.call(this, id, actionType, data);
    }
}