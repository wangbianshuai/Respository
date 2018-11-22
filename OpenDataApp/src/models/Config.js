import Index from "./Index"
import * as Common from "../utils/Common"

function InitModel() {
    const obj = new Index({
        EntityName: "Config",
        ActionList: [{ ActionName: "GetConfig", StateName: "Data", Method: "GET" }]
    })
    return Common.ToModels(obj)
}

export default InitModel()