//创建GUID
export function createGuid() {
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
export function trim(str) {
    return (str === undefined || str === null) ? "" : str.replace(/(^\s*)|(\s*$)/g, "").replace(new RegExp("(^　*)|(　*$)", "g"), "")
}

//字符串是否为空
export function isNullOrEmpty(value) {
    return (value === null || value === undefined) || trim(value.toString()) === ""
}

//字符串是否为空，如果为空只返回默认值，反之返回当前值
export function isNullOrEmptyReturnDefault(value, defaultValue) {
    return isNullOrEmpty(value) ? defaultValue : value;
}

//获取查询字符串
export function getQueryString(query) {
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
        args[argname] = decodeURIComponent(value)
    }
    return args
}

export function addUrlRandom(url) {
    if (isNullOrEmpty(url)) return ""

    const rc = getRandomChars()
    const rd = Math.random()
    url += url.indexOf("?") >= 0 ? "&" : "?"
    url += `_r${rc}=${rd}`
    return url
}

export function addUrlParams(url, name, value) {
    if (isNullOrEmpty(url)) return ""
    if (value === undefined || value === null) return url;
    url += url.indexOf("?") >= 0 ? "&" : "?"
    value = encodeURIComponent(value);
    url += `${name}=${value}`
    return url
}

export function getRandomChars(len) {
    len = len || 10
    var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz"
    var str = []
    for (var i = 0; i < len; i++) {
        str.push(chars.charAt(Math.floor(Math.random() * chars.length)))
    }
    return str.join("")
}

//是否数组
export function isArray(obj) {
    if (obj === null || obj === undefined) return false
    return typeof (obj) === "object" && obj.length >= 0
}

export function isFunction(obj) {
    return typeof obj === "function" && typeof obj.nodeType !== "number";
}

export function isEmptyArray(obj) {
    if (!isArray(obj) || obj.length === 0) return true;
    return false;
}

export function isNoEmptyArray(obj) {
    if (isArray(obj) && obj.length > 0) return true;
    return false;
}

export function isObject(obj) {
    if (obj === null || obj === undefined) return false
    return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length
}

export function getObjValue(obj, name, defaultValue) {
    if (!isObject(obj) || isNullOrEmpty(name)) return defaultValue

    for (let key in obj) if (key.toLowerCase() === name.toLowerCase()) return obj[key]

    return defaultValue
}

export function getRootPath(blPath) {
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

export function isEmptyObject(obj) {
    if (!isObject(obj)) return true

    if (Object.getOwnPropertyNames(obj).length > 0) return false

    let blEmpty = true
    for (let key in obj) if (key) { blEmpty = false; break; }

    return blEmpty
}

export function Copy(a, b, c) {
    if (!isObject(a) || !isObject(b)) return

    if (isArray(c)) {
        let n = ""
        for (let i = 0; i < c.length; i++) {
            n = c[i];
            if (b[n] !== undefined) a[n] = b[n];
            else for (let k in b) if (k === n) { a[n] = b[n]; break; }
        }
    }
    else for (let k in b) a[k] = b[k]
}

export function isEquals(a, b, c) {
    if (a === undefined && b === undefined) return true
    if (a === null && b === null) return true
    if (a === b) return true

    let a_isArray = isArray(a), b_isArray = isArray(b)
    let a_isObj = isObject(a), b_Obj = isObject(b)

    if ((a_isArray && !b_isArray) || (!a_isArray && b_isArray)) return false
    if ((a_isObj && !b_Obj) || (!a_isObj && b_Obj)) return false

    if (a_isArray && b_isArray) return isArrayEquals(a, b)
    if (a_isObj && b_Obj) return isObjectEquals(a, b)

    let sa = isNullOrEmpty(a) ? "" : a.toString()
    let sb = isNullOrEmpty(b) ? "" : b.toString()
    return c ? sa.toLowerCase() === sb.toLowerCase() : sa === sb
}

export function isArrayEquals(a, b) {
    if (a === b) return true
    if (a.length !== b.length) return false

    let blEquals = true
    for (let i = 0; i < a.length; i++) {
        blEquals = isObjectEquals(a[i], b[i])
        if (!blEquals) break
    }

    return blEquals
}

export function isObjectEquals(a, b) {
    if (a === b) return true

    let blEquals = true

    for (let k in a) {
        blEquals = isEquals(a[k], b[k])
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

export function arrayFirst(list, fn) {
    if (!isArray(list)) return null;
    const list2 = list.filter(fn)
    return list2.length > 0 ? list2[0] : null;
}

export function setStorage(key, value, time) {
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
        console.warn("utils-common/Common", ex);
    }
}

export function getStorage(key) {
    var value = ""
    try {
        value = window.localStorage.getItem(key)
        var tkey = key + "_Time";
        var tvs = window.localStorage.getItem(tkey)
        if (!isNullOrEmpty(tvs)) {
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
        console.warn("utils-common/common", ex);
    }
    return isNullOrEmpty(value) ? "" : value
}

export function removeStorage(key) {
    try {
        window.localStorage.removeItem(key);
    }
    catch (ex) {
        console.warn("utils-common/common", ex);
    }
}

export function getNumber(value, scale) {
    let f = parseFloat(value)
    if (isNaN(f)) return 0;
    if (f === 0) return f;

    scale = (scale || 2);
    scale = Math.pow(10, scale);
    return Math.round(f * scale) / scale
}

export function toCurrency(value, blFixed2) {
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

export function addComma(value) {
    if (!value || isNaN(value)) return value;
    const vs = value.toString().split('.');
    let value1 = vs[0];
    let value2 = vs.length > 1 ? '.' + vs[1] : '';
    var r = /(\d+)(\d{3})/
    while (r.test(value1)) {
        value1 = value1.replace(r, "$1,$2")
    }
    return value1 + value2;
}

export function toFixed(value, num) {
    if (!value) return value;
    return getNumber(value).toFixed(num);
}

export function getDateString(myDate, isDate) {
    if (isNullOrEmpty(myDate)) return "";
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

export function convertToDate(dateString, format) {
    if (typeof (dateString) === "number") return new Date(dateString);
    if (typeof dateString !== "string") return dateString;

    if (!format) return new Date(dateString);

    var year, month, day, hh, mm, ss, timeFormat, time;
    if (format.substring(0, 10) === "yyyy-MM-dd" || format.substring(0, 10) === "yyyy/MM/dd") {
        year = dateString.substring(0, 4);
        month = dateString.substring(5, 7);
        day = dateString.substring(8, 10);
        if (format.length > 10) timeFormat = trim(format.substring(10, format.length));
        if (format.length > 10) time = trim(dateString.substring(10, dateString.length));
    }
    if (format.substring(0, 10) === "MM-dd-yyyy" || format.substring(0, 10) === "MM/dd/yyyy") {
        year = dateString.substring(6, 10);
        month = dateString.substring(0, 2);
        day = dateString.substring(3, 5);
        if (format.length > 10) timeFormat = trim(format.substring(10, format.length));
        if (format.length > 10) time = trim(dateString.substring(10, dateString.length));
    }
    if (format.substring(0, 8) === "yyyyMMdd") {
        year = dateString.substring(0, 4);
        month = dateString.substring(4, 6);
        day = dateString.substring(6, 8);
        if (format.length > 8) timeFormat = trim(format.substring(8, format.length));
        if (format.length > 8) time = trim(dateString.substring(8, dateString.length));
    }
    if (format.substring(0, 8) === "MMddyyyy") {
        year = dateString.substring(4, 8);
        month = dateString.substring(0, 2);
        day = dateString.substring(2, 4);
        if (format.length > 8) timeFormat = trim(format.substring(8, format.length));
        if (format.length > 8) time = trim(dateString.substring(8, dateString.length));
    }
    if (!isNullOrEmpty(time) && !isNullOrEmpty(timeFormat)) {
        if (!isNullOrEmpty(timeFormat) && timeFormat === "HH:mm:ss") {
            hh = time.substring(0, 2);
            mm = time.substring(3, 5);
            ss = time.substring(6, 8);
        }
        else if (!isNullOrEmpty(timeFormat) && timeFormat === "HHmmss") {
            hh = time.substring(0, 2);
            mm = time.substring(2, 4);
            ss = time.substring(4, 6);
        }
    }

    year = getIntValue(year);
    month = getIntValue(month) - 1;
    day = getIntValue(day);

    if (!isNullOrEmpty(time) && !isNullOrEmpty(timeFormat)) {
        hh = getIntValue(hh);
        mm = getIntValue(mm);
        ss = getIntValue(ss);

        return new Date(year, month, day, hh, mm, ss);
    }
    else return new Date(year, month, day);
}

export function getCurrentDate() {
    var myDate = new Date();
    return getDateString(myDate);
}

export function jsonParse(str) {
    if (isNullOrEmpty(str)) return null;

    return JSON.parse(str);
}

export function arrayMax(list, name) {
    if (list.length === 0) return null;
    list = list.sort((a, b) => a[name] > b[name] ? -1 : 1)
    return list[0]
}

export function getFloatValue(value) {
    if (typeof (value) === "number") return value;
    const f = parseFloat(value)
    return isNaN(f) ? 0 : f;
}

export function getIntValue(value) {
    const i = parseInt(value, 10)
    return isNaN(i) ? 0 : i;
}

export function dateFormat(date, format) {
    if (!date) return date;
    if (typeof (date) === "number") date = getDateString(new Date(date));
    if (format === "yyyy/MM/dd" || format === "yyyy-MM-dd") {
        const s = date.toString().substr(0, 10);
        const st = format === "yyyy/MM/dd" ? "/" : "-";
        return s.substr(0, 4) + st + s.substr(5, 2) + st + s.substr(8, 2);
    }
    return date;
}

export function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    arr = document.cookie.match(reg)
    if (arr) return decodeURIComponent(arr[2]);
    else return null;
}

export function setCookie(name, value, days, path) {
    days = days || 1;
    path = path || "/";
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + exp.toGMTString() + "; path=" + path;
}

export function removeCookie(name, path) {
    setCookie(name, "", -1, path);
}

export function numbertoTime(surplus) {
    if (!surplus) return surplus;

    var surplusHour = parseInt((surplus / 1000) / 60 / 60, 10);//剩余小时
    var surplusMinute = parseInt((surplus % (1000 * 60 * 60)) / (1000 * 60), 10);//剩余分
    var surplusSecond = parseInt((surplus % (1000 * 60)) / 1000, 10);//剩余秒
    if (surplusHour < 10) surplusHour = "0" + surplusHour;
    if (surplusMinute < 10) surplusMinute = "0" + surplusMinute;
    if (surplusSecond < 10) surplusSecond = "0" + surplusSecond;
    return surplusHour + ":" + surplusMinute + ":" + surplusSecond;
}

//判断输入文本框是否是输入两位小数的浮点数
export function isDecimal2(value) {
    var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$|^(-?\\d+)(\\.\\d{2})?$");
    return reg.test(value);
}

export function toQueryString(obj) {
    const list = [];
    let v = null;
    for (let key in obj) { v = encodeURIComponent(obj[key]); list.push(`${key}=${v}`); }
    return list.join("&")
}

export function isWeiXin() {
    return !!window.navigator.userAgent.match(/MicroMessenger/i);
}

export function isH5() {
    const ua = navigator.userAgent;
    if ((ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) return true;

    var bisIpad = ua.match(/ipad/i) === "ipad";
    var bisIphoneOs = ua.match(/iphone os/i) === "iphone os";
    var bisMidp = ua.match(/midp/i) === "midp";
    var bisUc7 = ua.match(/rv:1.2.3.4/i) === "rv:1.2.3.4";
    var bisUc = ua.match(/ucweb/i) === "ucweb";
    var bisAndroid = ua.match(/android/i) === "android";
    var bisCE = ua.match(/windows ce/i) === "windows ce";
    var bisWM = ua.match(/windows mobile/i) === "windows mobile";

    if (bisIpad || bisIphoneOs || bisMidp || bisUc7 || bisUc || bisAndroid || bisCE || bisWM) return true;

    if (ua.match(/okhttp/) || ua.match(/Xxd\/iOS_finance/)) return true;

    if (ua.match(/AppleWebKit.*Mobile.*/)) return true;

    return false;
}

export function setDefaultValue(obj, name, value) {
    if (obj[name] === undefined) obj[name] = value;
}

export function listForEach(list, fn) {
    for (let i = 0; i < list.length; i++) {
        if (fn(list[i], i) === false) {
            break;
        }
    }
}

//不四舍五入直接截断
export function toCurrencyNo45(num) {
    num = getFloatValue(num).toFixed(3);
    return num.substring(0, num.lastIndexOf('.') + 3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

export function replaceDataContent(data, content) {
    if (!content || !data) return content;

    if (content.indexOf("#{") < 0) return content;
    let keyValue = "", v = null;
    for (let key in data) {
        keyValue = "#{" + key + "}";
        v = data[key];
        v = isNullOrEmpty(v) ? "" : v.toString();
        v = decodeURIComponent(v);
        content = content.replace(new RegExp(keyValue, "g"), v);
        if (content.indexOf("#{") < 0) break;
    }
    return content;
}


export function assign(a, b, c) {
    if (!isObject(a)) return a

    const objList = []
    if (isObject(b)) for (let k in b) a[k] = clone(b[k], objList)

    if (isObject(c)) for (let k in c) a[k] = clone(c[k], objList)

    return a
}

export function arrayClone(a, objList) {
    if (!isArray(a)) return a

    var dataList = []
    for (var i = 0; i < a.length; i++) {
        dataList.push(clone(a[i], objList))
    }
    return dataList
}

export function clone(a, objList) {
    objList = objList === undefined ? [] : objList;
    if (isArray(a)) return arrayClone(a, objList)

    if (!isObject(a)) return a

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
        if (isArray(a[key])) {
            c[key] = arrayClone(a[key], objList)
        }
        else if (isObject(a[key])) {
            c[key] = clone(a[key], objList)
        }
        else {
            c[key] = a[key]
        }
    }

    return c
}

export function inherit(obj1, obj2) {
    if (!isObject(obj1) || !isObject(obj2)) return

    for (var key in obj2) if (obj1[key] === undefined) obj1[key] = obj2[key];
}

export function isAdmin() {
    const { pathname } = window.location;
    return pathname.toLowerCase().indexOf("/admin") === 0;
}

export function getImageUrl(name) {
    return require(`../assets/${name}`);
}

export function remvoeHtmlTag(html) {
    if (isNullOrEmpty(html)) return html;

    html = html.replace(/<[^>]+>/g, "");
    html = html.replace(/&nbsp;/ig, "");
    html = html.replace(/&middot;/ig, "");
    html = html.replace(/&mdash;/ig, "");
    html = html.replace(/&bull;/g, "");
    html = html.replace(/&#(\d+);/g, "");
    html = html.replace(/&lt;/g, "<");
    html = html.replace(/&gt;/g, ">");
    html = html.replace(/([\r\n])[\s]+/g, "");

    html = trim(html)

    return html;
}

export function postFormData(url, formData, successCallback, errorCallback, async) {
    var xmlHttp = null;

    //创建请求
    xmlHttp = createRequest();

    //打开请求
    xmlHttp.open('POST', addUrlRandom(url), async);

    //处理请求响应返回
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                successCallback && successCallback(JSON.parse(xmlHttp.responseText));
            }
            else {
                const msg = xmlHttp.statusText ? xmlHttp.status + ":" + xmlHttp.statusText : xmlHttp.responseText;
                errorCallback && errorCallback(msg);
            }
        }
    };

    //发送请求
    xmlHttp.send(formData);

    //创建请求对象
    function createRequest() {
        return new XMLHttpRequest();
    };

    return xmlHttp
}

export function getFileExt(fileName) {
    if (isNullOrEmpty(fileName)) return '';
    const ns = fileName.split('.');
    if (ns.length < 2) return '';
    return ns.pop().toLowerCase();
}

export function getImageFileWidthHeight(file) {
    return new Promise((resolve, reject) => {
        try {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                var image = new Image();
                image.onload = function () {
                    var width = image.width;
                    var height = image.height;
                    resolve({ width, height });
                };
                image.src = data;
            };
            reader.readAsDataURL(file);
        }
        catch (err) {
            reject(err);
        }
    });
}

export function compressImage(file, width, height, type, quality, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        try {
            var ready = new FileReader();
            ready.readAsDataURL(file);
            ready.onload = function () {
                getImage(this.result).then(res => {
                    resolve(canvasDataURL(res, width, height, type, quality, maxWidth, maxHeight));
                });
            }
        } catch (err) { reject(err); }
    });
}

export function getImage(src) {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();
            img.src = src;
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function (err) {
                reject(err);
            };
        }
        catch (err) { reject(err); }
    })
}

export function canvasDataURL(img, width, height, type, quality, maxWidth, maxHeight) {
    width = width || img.width;
    height = height || img.height;
    type = type || 'image/jpeg';
    quality = quality || 0.5;
    maxWidth = maxWidth || 1920;
    maxHeight = maxHeight || 1080;

    if (width > maxWidth) {
        height = maxWidth * height / width;
        width = maxWidth;
    }
    if (height > maxHeight) {
        width = maxHeight * width / height;
        height = maxHeight;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
    return canvas.toDataURL(type, quality);
}

export function dataURItoBlob(base64Data) {
    //console.log(base64Data);//data:image/png;base64,
    var byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(base64Data.split(',')[1]);//base64 解码
    else {
        byteString = unescape(base64Data.split(',')[1]);
    }
    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];//mime类型 -- image/png

    // var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
    // var ia = new Uint8Array(arrayBuffer);//创建视图
    var ia = new Uint8Array(byteString.length);//创建视图
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ia], {
        type: mimeString
    });
    return blob;
}

export function blobToDataURI(blob, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function (e) {
        callback(e.target.result);
    }
}

//将base64转换为文件
export function dataURLtoFile(dataUrl, filename) {
    var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}   