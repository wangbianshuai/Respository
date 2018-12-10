import Index from "./Index"
import * as Common from "../utils/Common"

function InitModel() {
    const obj = new Index({
        Name: "Product",
        ActionList: [{ ActionName: "HotProduct", Url: "Product/GetHotList", StateName: "ProductList", },
        { ActionName: "RecommandProduct", Url: "Product/GetHotList", StateName: "RecommandProductList" },
        { ActionName: "AllProducts", Url: "Product/GetList", StateName: "AllProductList" },
        { ActionName: "Product", Url: "Product/GetProduct", StateName: "Product" }]
    })
    return Common.ToModels(obj)
}

export default InitModel()