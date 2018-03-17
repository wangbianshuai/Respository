import Index from "./Index"
import * as Common from "../utils/Common"

function InitModel() {
    const obj = new Index({
        Name: "Config",
        ActionList: [{ ActionName: "GetConfig", StateName: "Data", DataKey: "$EntityConfig", Method: "GET" }]
    })
    return Common.ToModels(obj)
}

export default InitModel()