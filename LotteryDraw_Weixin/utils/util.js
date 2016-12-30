function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//字符串去掉空格
function StringTrim(str) {
  return (str === undefined || str === null) ? "" : str.replace(/(^\s*)|(\s*$)/g, "").replace(/(^　*)|(　*$)/g, "")
}

//是否数组
function IsArray(obj) {
  return typeof (obj) === "object" && obj.length >= 0
}

//字符串格式化
function StringFormat(str, array) {
  if (StringIsNullOrEmpty(str)) {
    return ""
  }
  if (IsArray(array)) {
    for (var i = 0; i < array.length; i++) {
      array[i] = StringIsNullOrEmpty(array[i]) ? "" : array[i].toString()
      str = str.replace(new RegExp("\\{" + i.toString() + "\\}", "g"), array[i])
    }
  }
  return str
}

//字符串是否为空
function StringIsNullOrEmpty(value) {
  return (value === null || value === undefined) || StringTrim(value.toString()) == ""
}

//创建GUID
function CreateGuid() {
  var guid = ""
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16)
    guid += n
    if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
      guid += "-"
    }
  }
  return guid
}

//是否对象
function IsObject(obj) {
  if (obj === null || obj === undefined) {
    return false
  }
  return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length
}

//是否空对象
function IsEmptyObject(obj) {
  if (obj === null || obj === undefined) {
    return true
  }
  if (typeof (obj) === "object" && obj.length > 0) {
    return false
  }
  if (typeof (obj) === "object") {
    var blExists = false;
    for (var key in obj) {
      blExists = true
      break
    }
    return !blExists
  }
  return false;
}

//克隆对象
function Clone(obj) {
  if (!IsEmptyObject(obj)) {
    return obj
  }
  if (IsArray(obj)) {
    var list = []
    for (var i = 0; i < obj.length; i++) {
      list.push(Clone(obj[i]))
    }
    return list;
  }
  else if (IsObject(obj)) {
    var cloneObj = {}
    for (var key in obj) {
      if (IsArray(obj[key]) || IsObject(obj[key])) {
        cloneObj[key] = Clone(obj[key])
      }
      else {
        cloneObj[key] = obj[key]
      }
    }
    return cloneObj
  }
  return obj
}

function alert2(message, callback) {
  wx.showModal({
    title: "提示信息",
    showCancel: false,
    content: message,
    complete: callback
  })
}

function confirm2(message, callback) {
  wx.showModal({
    title: "确认信息",
    content: message,
    confirmText: "确认",
    success: function (res) {
      res.confirm && callback()
    }
  })
}

function showActionSheet(itemList, callback, thisObj) {
  wx.showActionSheet({
    itemList: itemList,
    success: function (res) {
      if (!res.cancel) {
        callback.call(thisObj, res.tapIndex)
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  IsArray: IsArray,
  StringTrim: StringTrim,
  StringIsNullOrEmpty: StringIsNullOrEmpty,
  StringFormat: StringFormat,
  CreateGuid: CreateGuid,
  alert: alert2,
  confirm: confirm2,
  showActionSheet: showActionSheet,
  Clone: Clone,
  IsArray: IsArray,
  IsObject: IsObject,
  IsEmptyObject: IsEmptyObject
}
