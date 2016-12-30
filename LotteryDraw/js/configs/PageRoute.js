import * as Common from "../utils/Common"

import Index from "../pages/Index"
import LotterySet from "../pages/LotterySet"
import LotteryTypeList from "../pages/LotteryTypeList"
import LotteryTypeEdit from "../pages/LotteryTypeEdit"
import ProductList from "../pages/ProductList"
import ProductEdit from "../pages/ProductEdit"
import LotteryDraw from "../pages/LotteryDraw"
import LotteryRecord from "../pages/LotteryRecord"

const PageList = {
    Index,
    LotterySet,
    LotteryTypeList,
    LotteryTypeEdit,
    ProductList,
    ProductEdit,
    LotteryDraw,
    LotteryRecord
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
