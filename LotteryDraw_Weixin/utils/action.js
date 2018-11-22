//行为方法

var util = require('util.js')
//引用数据方法
var dataAccess = require("dataAccess.js")

var lotteryType = require("../data/LotteryType.js")
var product = require("../data/Product.js")
var userInfo = require("../data/UserInfo.js")
var lotteryRecord = require("../data/LotteryRecord.js")

//获取中奖类型列表
function GetLotteryTypeList() {
    var url = "LotteryType/GetLotteryTypeList"

    return lotteryType.DataList.map(function (item) { return item })
}

//以主键获取中奖类型
function GetLotteryType(id) {
    var list = lotteryType.DataList.filter(function (item) { return item.LotteryTypeId === id })
    if (list.length > 0) {
        return util.Clone(list[0])
    }
    return null
}

//保存中奖类型
function SaveLotteryType(entityData, callback) {
    var list = lotteryType.DataList.filter(function (item) { return item.LotteryTypeId === entityData.LotteryTypeId })

    if (list.length > 0) {
        //更新
        for (var key in entityData) {
            list[0][key] = entityData[key]
        }
    }
    else {
        //新增
        entityData.LotteryTypeId = util.CreateGuid()
        lotteryType.DataList.push(entityData)
    }

    //操作成功,调用callback
    callback()
}

//删除中奖类型 
function DeleteLotteryType(id, callback) {
    //var url = "LotteryType/Delete"
    //DeleteAction(url, callback)

    var index = -1;
    for (var i = 0; i < lotteryType.DataList.length; i++) {
        if (lotteryType.DataList[i].LotteryTypeId === id) {
            index = i
            break
        }
    }

    if (index >= 0) {
        lotteryType.DataList.splice(index, 1)
    }

    //操作成功,调用callback
    callback()
}

//删除行为
function DeleteAction(url, callback) {
}

//获取中奖产品列表
function GetProductList() {
    return product.DataList.map(function (item) { return item })
}

//以主键获取产品
function GetProduct(id) {
    var list = product.DataList.filter(function (item) { return item.ProductId === id })
    if (list.length > 0) {
        return util.Clone(list[0])
    }
    return null
}

//保存产品
function SaveProduct(entityData, callback) {
    var list = product.DataList.filter(function (item) { return item.ProductId === entityData.ProductId })

    if (list.length > 0) {
        //更新
        for (var key in entityData) {
            list[0][key] = entityData[key]
        }
    }
    else {
        //新增
        entityData.ProductId = util.CreateGuid()
        product.DataList.push(entityData)
    }

    //操作成功,调用callback
    callback()
}

//删除中奖类型 
function DeleteProduct(id, callback) {
    var index = -1;
    for (var i = 0; i < product.DataList.length; i++) {
        if (product.DataList[i].ProductId === id) {
            index = i
            break
        }
    }

    if (index >= 0) {
        product.DataList.splice(index, 1)
    }

    //操作成功,调用callback
    callback()
}

//用户签到
function SaveUser(userInfo, callback) {
    callback({ Success: true })
}

//获取可参与抽奖用户列表
function GetUserList(lotteryTypeId) {
    //TODO: 根据lotteryTypeId的互斥属性判断是否过滤掉已经中过奖的用户，如果互斥是true则过滤掉已中奖用户，如果互斥是false则显示所有用户
    // 根据中奖记录是否互斥判断是否需要过滤已中奖的用户
    var list = lotteryType.DataList.filter(function (item) {
        return item.LotteryTypeId == lotteryTypeId
    })
    //获取传入的lotterType信息
    var _lotteryType = {}
    if (list.length > 0) {
        _lotteryType = list[0]
        if (_lotteryType.IsMutex === 1) {
            //创建一个新的用户列表，遍历全部用户列表列表，
            //如果当前用户在中奖纪录中则不添加到新的userList里面里面，反之添加
            //copy一个新的userList
            var newUserList = userInfo.DataList.map(function (item) { return item })
            lotteryRecord.DataList.forEach(function (record) {
                var index = -1;
                for (var i = 0; i < newUserList.length; i++) {
                    //需要在中奖记录里面添加UserId
                    if (newUserList[i].UserId === record.UserId) {
                        index = i
                        break
                    }
                }

                if (index >= 0) {
                    newUserList.splice(index, 1)
                }
            })
            return newUserList
        }
    }

    //默认是获取所有用户或者lotteryType.IsMutex===0       
    return userInfo.DataList
}

//保存中奖记录
function SaveLotteryRecordList(recordList, callback) {
    recordList.forEach(function (item) { item.RecordId = util.CreateGuid() })
    lotteryRecord.DataList = lotteryRecord.DataList.concat(recordList)

    //操作成功,调用callback
    callback()
}

//获取中奖记录
function GetLotteryRecordList(lotteryTypeId, productId) {
    return lotteryRecord.DataList.filter(function (item) {
        return item.LotteryTypeId === lotteryTypeId && item.ProductId === productId
    }).sort(function (item) {
        return item.LotteryStatus ? 0 : 1 //根据LotteryStatus降序排序 
    }).map(function (item) { return item })
}

//作废中奖记录
function SetLotteryStatusInValid(recordId, callback) {
    var list = lotteryRecord.DataList.filter(function (item) { return item.RecordId === recordId })
    if (list.length > 0) {
        list[0].LotteryStatus = 0
    }

    //操作成功,调用callback
    callback()
}

//批量作废中奖记录
function BatchSetLotteryStatusInValid(recordIdList, callback) {
    var list = [];
    recordIdList.forEach(function (recordId) {
        list = lotteryRecord.DataList.filter(function (item) { return item.RecordId === recordId })
        if (list.length > 0) { list[0].LotteryStatus = 0 }
    })

    //操作成功,调用callback
    callback()
}

module.exports = {
    GetLotteryTypeList: GetLotteryTypeList,
    GetProductList: GetProductList,
    SaveUser: SaveUser,
    DeleteLotteryType: DeleteLotteryType,
    GetLotteryType: GetLotteryType,
    SaveLotteryType: SaveLotteryType,
    DeleteProduct: DeleteProduct,
    GetProduct: GetProduct,
    SaveProduct: SaveProduct,
    GetUserList: GetUserList,
    SaveLotteryRecordList: SaveLotteryRecordList,
    GetLotteryRecordList: GetLotteryRecordList,
    SetLotteryStatusInValid: SetLotteryStatusInValid,
    BatchSetLotteryStatusInValid: BatchSetLotteryStatusInValid
}