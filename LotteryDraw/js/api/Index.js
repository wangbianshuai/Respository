import LotteryType from '../data/LotteryType'
import Product from '../data/Product'
import LotteryRecord from '../data/LotteryRecord'
import UserInfo from '../data/UserInfo'
import * as Common from '../utils/Common'

function GetFetch(url) {
    return fetch(url).then(res => res.json())
}
function PostFetch(url, data) {
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(data)
    }).then(res => res.json())
}

export function GetLotteryTypeList() {
    return Promise.resolve(LotteryType.DataList.map((t) => t))
}

export function GetLotteryType(id) {
    if (Common.StringIsNullOrEmpty(id)) { return Promise.resolve(null) }

    const list = LotteryType.DataList.filter((item) => item.LotteryTypeId === id)
    let entityData = null
    if (list.length === 1) {
        entityData = Object.assign({}, list[0])
    }
    return Promise.resolve(entityData)
}

export function SaveLotteryType(entityData) {
    let blUpdate = !Common.StringIsNullOrEmpty(entityData.LotteryTypeId)

    if (blUpdate) {
        var list = LotteryType.DataList.filter(function (item) { return item.LotteryTypeId === entityData.LotteryTypeId })

        if (list.length === 1) {
            //更新
            for (var key in entityData) {
                list[0][key] = entityData[key]
            }
        }
    }
    else {
        //新增
        entityData.LotteryTypeId = Common.CreateGuid()
        LotteryType.DataList.push(entityData)
    }

    return Promise.resolve({ IsSuccess: true })
}

export function DeleteLotteryType(id) {
    var index = -1;
    for (var i = 0; i < LotteryType.DataList.length; i++) {
        if (LotteryType.DataList[i].LotteryTypeId === id) {
            index = i
            break
        }
    }

    if (index >= 0) {
        LotteryType.DataList.splice(index, 1)
    }

    return Promise.resolve({ IsSuccess: true })
}

export function GetProductList() {
    return Promise.resolve(Product.DataList.map((t) => t))
}

export function GetProduct(id) {
    if (Common.StringIsNullOrEmpty(id)) { return Promise.resolve(null) }

    const list = Product.DataList.filter((item) => item.ProductId === id)
    let entityData = null
    if (list.length === 1) {
        entityData = Object.assign({}, list[0])
    }
    return Promise.resolve(entityData)
}

export function SaveProduct(entityData) {
    let blUpdate = !Common.StringIsNullOrEmpty(entityData.ProductId)

    if (blUpdate) {
        var list = Product.DataList.filter(function (item) { return item.ProductId === entityData.ProductId })

        if (list.length === 1) {
            //更新
            for (var key in entityData) {
                list[0][key] = entityData[key]
            }
        }
    }
    else {
        //新增
        entityData.ProductId = Common.CreateGuid()
        Product.DataList.push(entityData)
    }

    return Promise.resolve({ IsSuccess: true })
}

export function DeleteProduct(id) {
    var index = -1;
    for (var i = 0; i < Product.DataList.length; i++) {
        if (Product.DataList[i].ProductId === id) {
            index = i
            break
        }
    }

    if (index >= 0) {
        Product.DataList.splice(index, 1)
    }

    return Promise.resolve({ IsSuccess: true })
}

export function GetLotteryRecordList(lotteryTypeId, productId) {
    return Promise.resolve(LotteryRecord.DataList.filter((item) => {
        return item.LotteryTypeId === lotteryTypeId && item.ProductId === productId
    }).sort((a, b) => a.LotteryStatus > b.LotteryStatus ? -1 : 1).map((item) => item))
}

export function SetLotteryStatusInValid(recordId) {
    var list = LotteryRecord.DataList.filter((item) => item.RecordId === recordId)
    if (list.length > 0) {
        list[0].LotteryStatus = 0
    }

    return Promise.resolve({ IsSuccess: true })
}


export function SaveLotteryRecordList(recordList) {
    recordList.forEach((item) => item.RecordId = Common.CreateGuid())
    LotteryRecord.DataList = LotteryRecord.DataList.concat(recordList)

    return Promise.resolve({ IsSuccess: true })
}

export function GetUserList(lotteryTypeId) {
    const list = LotteryType.DataList.filter((item) => item.LotteryTypeId == lotteryTypeId)

    if (list.length > 0 && list[0].IsMutex === 1) {
        let newUserList = UserInfo.DataList.map((item) => item)

        LotteryRecord.DataList.forEach((record) => {
            var index = -1;
            for (var i = 0; i < newUserList.length; i++) {
                if (newUserList[i].UserId === record.UserId) {
                    index = i
                    break
                }
            }

            if (index >= 0) {
                newUserList.splice(index, 1)
            }
        })

        return Promise.resolve(newUserList)
    }

    return Promise.resolve(UserInfo.DataList)
}