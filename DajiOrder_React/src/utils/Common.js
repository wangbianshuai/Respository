//获取查询字符串
export function GetQueryString(query) {
  let args = {}
  query = query || location.search.substring(1)
  var pairs = query.split("&")
  for (let i = 0; i < pairs.length; i++) {
    let pos = pairs[i].indexOf('=')
    if (pos == -1) continue
    let argname = pairs[i].substring(0, pos)
    let value = pairs[i].substring(pos + 1)
    args[argname] = unescape(value)
  }
  return args
}

export function GetProductValue(obj, name) {
  if (!IsObject(obj) || StringIsNullOrEmpty(name)) { return null }

  let value = null

  if (obj[name] !== undefined) {
    value = obj[name]
  }
  else {
    for (let key in obj) {
      if (key.toLowerCase() === name.toString().toLowerCase()) {
        value = obj[key]
        break
      }
    }
  }

  return value
}

//创建GUID
export function CreateGuid() {
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

//字符串去掉空格
export function StringTrim(str) {
  return (str === undefined || str === null) ? "" : str.replace(/(^\s*)|(\s*$)/g, "").replace(new RegExp("(^　*)|(　*$)", "g"), "")
}

//字符串是否为空
export function StringIsNullOrEmpty(value) {
  return (value === null || value === undefined) || StringTrim(value.toString()) === ""
}

export function IsInt(value) {
  var i = parseInt(value, 10)
  return !isNaN(i) && i.toString() === value.toString()
}

//是否对象
export function IsObject(obj) {
  if (obj === null || obj === undefined) {
    return false
  }
  return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length
}

//是否空对象
export function IsEmptyObject(obj) {
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
  return false
}

export function AddUrlRandom(url) {
  if (StringIsNullOrEmpty(url)) {
    return ""
  }

  const rc = GetRandomChars()
  const rd = Math.random()
  url += url.indexOf("?") > 0 ? "&" : "?"
  url += `_r${rc}=${rd}`
  return url
}

export function GetRandomChars(len) {
  len = len || 10
  var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz"
  var str = []
  for (var i = 0; i < len; i++) {
    str.push(chars.charAt(Math.floor(Math.random() * chars.length)))
  }
  return str.join("")
}