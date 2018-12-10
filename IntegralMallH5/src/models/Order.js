import Index from "./Index"
import * as Common from "../utils/Common"

function InitModel() {
    const obj = new Index({
        Name: "Order",
        ActionList: [{ ActionName: "ExChangeRecord", Url: "MyOrderList/GetMyOrderList", StateName: "MyExchangeList" },
        { ActionName: "Product", Url: "Product/Exchange", IsOperation: true, StateName: "ProductExchangeResult" },
        { ActionName: "ComfirmDelivered", Url: "MyOrderList/ComfirmDelivered", IsOperation: true, StateName: "ComfirmDeliveredResult" }]
    })
    return Common.ToModels(obj)
}

export default InitModel()