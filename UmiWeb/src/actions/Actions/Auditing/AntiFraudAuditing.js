import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class AntiFraudAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_AntiFraudAuditing";
        this.MinActionType = 1200;
        this.MaxActionType = 1299;

        this.Init();
    }

    //获取订单基本信息实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }
}