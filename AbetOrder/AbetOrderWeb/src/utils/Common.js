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

export function AddUrlParams(url, name, value) {
    if (IsNullOrEmpty(url)) return ""
    url += url.indexOf("?") > 0 ? "&" : "?"
    value = escape(value);
    url += `${name}=${value}`
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

//export const DataApiUrl = "http://localhost/aow/api/"
//export const ConfigApiUrl = "http://localhost/aowc/api/"
//export const IsDist = false;

export const DataApiUrl = GetRootPath() + "/api/";
export const ConfigApiUrl = GetRootPath() + "/configs/";
export const IsDist = true;

export function GetRootPath() {
    let names = window.location.pathname.substr(1).split("/");
    let path = ""
    if (names.length > 1) {
        names.splice(names.length - 1, 1);
        path = "/" + names.join("/");
    }

    return window.location.protocol + "//" + window.location.host + path;
}

export function IsEmptyObject(obj) {
    if (!IsObject(obj)) return true

    if (Object.getOwnPropertyNames(obj).length > 0) return false

    let blEmpty = true
    for (let key in obj) if (key) { blEmpty = false; break; }

    return blEmpty
}

export function Copy(a, b, c) {
    if (!IsObject(a) || !IsObject(b)) return

    if (IsArray(c)) {
        let n = ""
        for (let i = 0; i < c.length; i++) {
            n = c[i]
            if (b[n] !== undefined) a[n] = b[n]
            else for (let k in b) if (k === n) { a[n] = b[n]; break; }
        }
    }
    else for (let k in b) a[k] = b[k]
}

export function IsEquals(a, b, c) {
    if (a === undefined && b === undefined) return true
    if (a === null && b === null) return true
    if (a === b) return true

    let a_isArray = IsArray(a), b_isArray = IsArray(b)
    let a_isObj = IsObject(a), b_Obj = IsObject(b)

    if ((a_isArray && !b_isArray) || (!a_isArray && b_isArray)) return false
    if ((a_isObj && !b_Obj) || (!a_isObj && b_Obj)) return false

    if (a_isArray && b_isArray) return IsArrayEquals(a, b)
    if (a_isObj && b_Obj) return IsObjectEquals(a, b)

    let sa = IsNullOrEmpty(a) ? "" : a.toString()
    let sb = IsNullOrEmpty(b) ? "" : b.toString()
    return c ? sa.toLowerCase() === sb.toLowerCase() : sa === sb
}

export function IsArrayEquals(a, b) {
    if (a === b) return true
    if (a.length !== b.length) return false

    let blEquals = true
    for (let i = 0; i < a.length; i++) {
        blEquals = IsObjectEquals(a[i], b[i])
        if (!blEquals) break
    }

    return blEquals
}

export function IsObjectEquals(a, b) {
    if (a === b) return true

    let blEquals = true

    for (let k in a) {
        blEquals = IsEquals(a[k], b[k])
        if (!blEquals) break;
    }

    if (blEquals) {
        for (let k in b) {
            if (a[k] === undefined) {
                blEquals = false
                break;
            }
        }
    }

    return blEquals
}

export function ArrayFirst(list, fn) {
    const list2 = list.filter(fn)
    return list2.length > 0 ? list2[0] : null;
}

export function SetStorage(key, value, time) {
    try {
        time = time || 0;
        window.localStorage.setItem(key, value)

        if (time > 0) {
            key += "_Time"
            var tv = (new Date().getTime() + time * 60 * 1000).toString() + "_" + time.toString()
            window.localStorage.setItem(key, tv)
        }
    }
    catch (ex) {
    }
}

export function GetStorage(key) {
    var value = ""
    try {
        value = window.localStorage.getItem(key)
        var tkey = key + "_Time";
        var tvs = window.localStorage.getItem(tkey)
        if (!IsNullOrEmpty(tvs)) {
            var vs = tvs.split("_")
            var tv = parseFloat(vs[0])
            var time = parseFloat(vs[1])
            if (tv > 0) {
                var ct = new Date().getTime()
                if (ct > tv) {
                    value = ""
                    window.localStorage.removeItem(key)
                    window.localStorage.removeItem(tkey)
                }
                else {
                    tv = (new Date().getTime() + time * 60 * 1000).toString() + "_" + time.toString()
                    window.localStorage.setItem(tkey, tv)
                }
            }
        }
    }
    catch (ex) {
    }
    return IsNullOrEmpty(value) ? "" : value
}

export function GetNumber(value, scale) {
    let f = parseFloat(value)
    if (isNaN(f)) return value

    scale = (scale || 2);
    scale = Math.pow(10, scale);
    return Math.round(f * scale) / scale
}

export function ToCurrency(value, blFixed2) {
    blFixed2 = blFixed2 === undefined ? true : blFixed2
    var floatValue = isNaN(value) ? parseFloat(value) : value
    if (isNaN(floatValue)) {
        return value
    }
    else {
        var flString = blFixed2 ? floatValue.toFixed(2) : floatValue.toString()
        var r = /(\d+)(\d{3})/
        while (r.test(flString)) {
            flString = flString.replace(r, "$1,$2")
        }
        return flString
    }
}

export function GetDateString(myDate, isDate) {
    var year = myDate.getFullYear().toString();
    var month = (myDate.getMonth() + 1);
    month = month < 10 ? "0" + month.toString() : month.toString();
    var day = myDate.getDate();
    day = day < 10 ? "0" + day.toString() : day.toString();
    if (isDate) {
        return year + "-" + month + "-" + day;
    }
    else {
        var hh = myDate.getHours();
        hh = hh < 10 ? "0" + hh.toString() : hh.toString();
        var mm = myDate.getMinutes();
        mm = mm < 10 ? "0" + mm.toString() : mm.toString();
        var ss = myDate.getSeconds();
        ss = ss < 10 ? "0" + ss.toString() : ss.toString();
        return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
    }
}

export function GetCurrentDate() {
    var myDate = new Date();
    return GetDateString(myDate);
}

export function JsonParse(str) {
    if (IsNullOrEmpty(str)) return null;

    return JSON.parse(str);
}

export function ArrayMax(list, name) {
    if (list.length === 0) return null;
    list = list.sort((a, b) => a[name] > b[name] ? -1 : 1)
    return list[0]
}

export function GetFloatValue(value) {
    if (!isNaN(value)) return value;
    const f = parseFloat(value)
    return isNaN(f) ? 0 : f;
}