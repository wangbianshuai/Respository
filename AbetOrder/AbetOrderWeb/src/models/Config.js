import Index from "./Index"
import * as Common from "../utils/Common"

function InitModel() {
    const obj = new Index({
        Name: "Config",
        ActionList: [GetAction("Bill"),
        GetAction("BillType"),
        GetAction("ContentTag"),
        GetAction("Customer"),
        GetAction("DealingsBill"),
        GetAction("DealingsBillType"),
        GetAction("DealingsBook"),
        GetAction("SearchHistory"),
        GetAction("Factory"),
        GetAction("OperationLog"),
        GetAction("OrderEdit"),
        GetAction("OrderList"),
        GetAction("OrderPdf"),
        GetAction("PersonBill"),
        GetAction("ProcessItem"),
        GetAction("ProcessOrderList"),
        GetAction("TemplateHtml"),
        GetAction("User"),
        GetAction("RemarkItem")]
    })
    return Common.ToModels(obj)
}

function GetAction(name) {
    return { ActionName: name + "_GetConfig", ActionName2: "GetConfig", StateName: name, DataKey: "$EntityConfig", Method: "GET" }
}

export default InitModel()