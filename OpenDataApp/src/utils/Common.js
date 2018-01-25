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
    return guid.toLowerCase()
}

//字符串去掉空格
export function Trim(str) {
    return (str === undefined || str === null) ? "" : str.replace(/(^\s*)|(\s*$)/g, "").replace(new RegExp("(^　*)|(　*$)", "g"), "")
}

//字符串是否为空
export function IsNullOrEmpty(value) {
    return (value === null || value === undefined) || Trim(value.toString()) === ""
}

//获取查询字符串
export function GetQueryString(query) {
    let args = {}
    const location = window.location
    query = query || location.search.substring(1)
    if (location.search === "") {
        const index = location.href.indexOf("?")
        if (index > 0) query = location.href.substring(index + 1)
    }
    var pairs = query.split("&")
    for (let i = 0; i < pairs.length; i++) {
        let pos = pairs[i].indexOf('=')
        if (pos === -1) continue
        let argname = pairs[i].substring(0, pos)
        let value = pairs[i].substring(pos + 1)
        args[argname] = unescape(value)
    }
    return args
}

export function AddUrlRandom(url) {
    if (IsNullOrEmpty(url)) return ""

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

//是否数组
export function IsArray(obj) {
    if (obj === null || obj === undefined) return false
    return typeof (obj) === "object" && obj.length >= 0
}


export function IsObject(obj) {
    if (obj === null || obj === undefined) return false
    return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length
}

export function GetObjValue(obj, name, defaultValue) {
    if (!IsObject(obj) || IsNullOrEmpty(name)) return defaultValue

    for (let key in obj) if (key.toLowerCase() === name.toLowerCase()) return obj[key]

    return defaultValue
}

export function ToModels(obj) {
    return {
        namespace: obj.namespace,
        state: obj.state,
        effects: obj.effects,
        reducers: obj.reducers,
        subscriptions: obj.subscriptions
    }
}

export const DataApiUrl = "http://localhost/op/api/"

export const ConfigApiUrl = "http://localhost/opac/api/"

export function IsEmptyObject(obj) {
    if (!IsObject(obj)) return true

    if(Object.getOwnPropertyNames(obj).length ===0) return true

    return false
}