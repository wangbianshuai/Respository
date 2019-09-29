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

//字符串是否为空，如果为空只返回默认值，反之返回当前值
export function IsNullOrEmptyReturnDefault(value, defaultValue) {
    return IsNullOrEmpty(value) ? defaultValue : value;
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
    url += url.indexOf("?") >= 0 ? "&" : "?"
    url += `_r${rc}=${rd}`
    return url
}

export function AddUrlParams(url, name, value, blUrl) {
    if (IsNullOrEmpty(url)) return ""
    if (value === undefined || value === null) return url;
    url += url.indexOf("?") >= 0 ? "&" : "?"
    value = blUrl ? encodeURIComponent(value) : escape(value);
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

export function IsFunction(obj) {
    return typeof obj === "function" && typeof obj.nodeType !== "number";
}

export function IsEmptyArray(obj) {
    if (!IsArray(obj) || obj.length === 0) return true;
    return false;
}

export function IsNoEmptyArray(obj) {
    if (IsArray(obj) && obj.length > 0) return true;
    return false;
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
        subscriptions: obj.subscriptions,
        actions: obj.ActionList
    }
}

export function GetRootPath(blPath) {
    if (blPath) {
        let names = window.location.pathname.substr(1).split("/");
        let path = ""
        if (names.length > 1) {
            names.splice(names.length - 1, 1);
            path = "/" + names.join("/") + "/";
        }

        return window.location.protocol + "//" + window.location.host + path;
    }
    return window.location.protocol + "//" + window.location.host + "/";
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
            n = c[i];
            if (b[n] !== undefined) a[n] = b[n];
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
    if (!IsArray(list)) return null;
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

export function RemoveStorage(key) {
    try {
        window.localStorage.removeItem(key);
    }
    catch (ex) {
    }
}

export function GetNumber(value, scale) {
    let f = parseFloat(value)
    if (isNaN(f)) return 0;
    if (f === 0) return f;

    scale = (scale || 2);
    scale = Math.pow(10, scale);
    return Math.round(f * scale) / scale
}

export function ToCurrency(value, blFixed2) {
    blFixed2 = blFixed2 === undefined ? true : blFixed2
    var floatValue = parseFloat(value);
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

export function ToFixed(value, num) {
    if (!value) return value;
    return GetNumber(value).toFixed(num);
}

export function GetDateString(myDate, isDate) {
    if (IsNullOrEmpty(myDate)) return "";
    if (typeof (myDate) === "number") myDate = new Date(myDate);

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
    if (typeof (value) === "number") return value;
    const f = parseFloat(value)
    return isNaN(f) ? 0 : f;
}

export function GetIntValue(value) {
    const i = parseInt(value, 10)
    return isNaN(i) ? 0 : i;
}

export function DateFormat(date, format) {
    if (!date) return date;
    if (typeof (date) === "number") date = GetDateString(new Date(date));
    if (format === "yyyy/MM/dd" || format === "yyyy-MM-dd") {
        const s = date.toString().substr(0, 10);
        const st = format === "yyyy/MM/dd" ? "/" : "-";
        return s.substr(0, 4) + st + s.substr(5, 2) + st + s.substr(8, 2);
    }
    return date;
}

export function GetCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    arr = document.cookie.match(reg)
    if (arr) return unescape(arr[2]);
    else return null;
}

export function SetCookie(name, value, days, path) {
    days = days || 1;
    path = path || "/";
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + "; expires=" + exp.toGMTString() + "; path=" + path;
}

export function RemoveCookie(name, path) {
    SetCookie(name, "", -1, path);
}

export function NumberToTime(surplus) {
    if (!surplus) return surplus;

    var surplusHour = parseInt((surplus / 1000) / 60 / 60);//剩余小时
    var surplusMinute = parseInt((surplus % (1000 * 60 * 60)) / (1000 * 60), 10);//剩余分
    var surplusSecond = parseInt((surplus % (1000 * 60)) / 1000, 10);//剩余秒
    if (surplusHour < 10) surplusHour = "0" + surplusHour;
    if (surplusMinute < 10) surplusMinute = "0" + surplusMinute;
    if (surplusSecond < 10) surplusSecond = "0" + surplusSecond;
    return surplusHour + ":" + surplusMinute + ":" + surplusSecond;
}

//判断输入文本框是否是输入两位小数的浮点数
export function IsDecimal2(value) {
    var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$|^(-?\\d+)(\\.\\d{2})?$");
    return reg.test(value);
}

export function ToQueryString(obj) {
    const list = [];
    let v = null;
    for (let key in obj) { v = escape(obj[key]); list.push(`${key}=${v}`); }
    return list.join("&")
}

export function IsMobileBrowser(ua) {
    if ((ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) return true;

    var bIsIpad = ua.match(/ipad/i) === "ipad";
    var bIsIphoneOs = ua.match(/iphone os/i) === "iphone os";
    var bIsMidp = ua.match(/midp/i) === "midp";
    var bIsUc7 = ua.match(/rv:1.2.3.4/i) === "rv:1.2.3.4";
    var bIsUc = ua.match(/ucweb/i) === "ucweb";
    var bIsAndroid = ua.match(/android/i) === "android";
    var bIsCE = ua.match(/windows ce/i) === "windows ce";
    var bIsWM = ua.match(/windows mobile/i) === "windows mobile";

    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) return true;

    if (ua.match(/okhttp/) || ua.match(/Xxd\/iOS_finance/)) return true;

    if (ua.match(/AppleWebKit.*Mobile.*/)) return true;

    return false;
}

export function SetDefaultValue(obj, name, value) {
    if (obj[name] === undefined) obj[name] = value;
}

export function ListForEach(list, fn) {
    for (let i = 0; i < list.length; i++) {
        if (fn(list[i], i) === false) {
            break;
        }
    }
}

//不四舍五入直接截断
export function ToCurrencyNo45(num) {
    num = GetFloatValue(num).toFixed(3);
    return num.substring(0, num.lastIndexOf('.') + 3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

export function ReplaceDataContent(data, content, blUrl) {
    if (!content || !data) return content;

    if (content.indexOf("#{") < 0) return content;
    let keyValue = "", v = null;
    for (let key in data) {
        keyValue = "#{" + key + "}";
        v = data[key];
        v = IsNullOrEmpty(v) ? "" : v.toString();
        v = unescape(v);
        content = content.replace(new RegExp(keyValue, "g"), blUrl ? escape(v) : v);
        if (content.indexOf("#{") < 0) break;
    }
    return content;
}

export function GetPageData() {
    const str = GetStorage("PageData");
    if (IsNullOrEmpty(str)) return {};

    return JSON.parse(str);
}

export function SetPageData(data) {
    SetStorage("PageData", JSON.stringify(data));
}

export function Assign(a, b, c) {
    if (!IsObject(a)) return a

    const objList = []
    if (IsObject(b)) for (let k in b) a[k] = Clone(b[k], objList)

    if (IsObject(c)) for (let k in c) a[k] = Clone(c[k], objList)

    return a
}

export function ArrayClone(a, objList) {
    if (!IsArray(a)) return a

    var dataList = []
    for (var i = 0; i < a.length; i++) {
        dataList.push(Clone(a[i], objList))
    }
    return dataList
}

export function Clone(a, objList) {
    objList = objList === undefined ? [] : objList;
    if (IsArray(a)) return ArrayClone(a, objList)

    if (!IsObject(a)) return a

    var blExists = false
    for (var i = 0; i < objList.length; i++) {
        if (objList[i] === a) {
            blExists = true
            break
        }
    }

    if (blExists) return a

    objList.push(a)

    var c = {}

    for (var key in a) {
        if (IsArray(a[key])) {
            c[key] = ArrayClone(a[key], objList)
        }
        else if (IsObject(a[key])) {
            c[key] = Clone(a[key], objList)
        }
        else {
            c[key] = a[key]
        }
    }

    return c
}