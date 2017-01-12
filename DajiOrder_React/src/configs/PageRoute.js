import * as Common from "../utils/Common"

import Index from "../pages/Index"
import Login from "../pages/Login"
import ProductList from "../pages/ProductList"

const PageList = {
    Index,
    Login,
    ProductList
}

export default function () {
    let routeList = []
    for (let key in PageList) {
        routeList.push({
            Id: Common.CreateGuid(),
            Name: key,
            Page: PageList[key]
        })
    }
    return routeList
}
