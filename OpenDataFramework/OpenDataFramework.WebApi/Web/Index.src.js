const $ns = { utils: {}, actions: {}, api: {}, data: {}, layouts: {}, controls: {}, components: {}, pages: {} };
window.OpenDataFramework = $ns;
((ns) => {
    ns.utils.Common = class Common {

        static CreateGuid() {
            let guid = ""
            for (let i = 1; i <= 32; i++) {
                let n = Math.floor(Math.random() * 16.0).toString(16)
                guid += n
                if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
                    guid += "-"
                }
            }
            return guid
        }

        static IsNullOrEmpty(value) {
            return (value === null || value === undefined) || Common.Trim(value.toString()) === ""
        }

        static Trim(str) {
            return (str === undefined || str === null) ? "" : str.toString().replace(/(^\s*)|(\s*$)/g, "").replace(new RegExp("(^　*)|(　*$)", "g"), "")
        }

        static AddUrlRandom(url) {
            if (Common.IsNullOrEmpty(url)) { return "" }

            const rc = Common.GetRandomChars(), rd = Math.random()
            url += url.indexOf("?") > 0 ? "&" : "?"
            url += `_r${rc}=${rd}`

            return url
        }

        static GetRandomChars(len) {
            len = len || 10
            const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz", str = []
            for (let i = 0; i < len; i++) {
                str.push(chars.charAt(Math.floor(Math.random() * chars.length)))
            }
            return str.join("")
        }

        static InitValue(obj, names, value) {
            names.forEach((name) => { obj[name] = obj[name] === undefined ? value : obj[name] })
        }

        static Alert(message) {
            return new ns.components.AlertConfirm({ Message: message }).Show()
        }

        static Confirm(message) {
            return new ns.components.AlertConfirm({ Message: message, IsConfirm: true }).Show()
        }

        static ArrayFirst(list) {
            return list && list.length > 0 ? list[0] : null
        }

        static IsArray(obj) {
            if (obj === null || obj === undefined) return false
            return typeof (obj) === "object" && obj.length >= 0
        }

        static IsObject(obj) {
            if (obj === null || obj === undefined) return false
            return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length
        }

        static IsEquals(a, b, c) {
            if (a === undefined && b === undefined) return true
            if (a === null && b === null) return true
            if (a === b) return true

            let a_isArray = Common.IsArray(a), b_isArray = Common.IsArray(b)
            let a_isObj = Common.IsObject(a), b_Obj = Common.IsObject(b)

            if ((a_isArray && !b_isArray) || (!a_isArray && b_isArray)) return false
            if ((a_isObj && !b_Obj) || (!a_isObj && b_Obj)) return false

            if (a_isArray && b_isArray) return Common.IsArrayEquals(a, b)
            if (a_isObj && b_Obj) return Common.IsObjectEquals(a, b)

            let sa = Common.IsNullOrEmpty(a) ? "" : a.toString()
            let sb = Common.IsNullOrEmpty(b) ? "" : b.toString()
            return c ? sa.toLowerCase() === sb.toLowerCase() : sa === sb
        }

        static IsArrayEquals(a, b) {
            if (a === b) return true
            if (a.length != b.length) return false

            let blEquals = true
            for (let i = 0; i < a.length; i++) {
                blEquals = Common.IsObjectEquals(a[i], b[i])
                if (!blEquals) break
            }

            return blEquals
        }

        static IsObjectEquals(a, b) {
            if (a === b) return true

            let blEquals = true

            for (let k in a) {
                blEquals = Common.IsEquals(a[k], b[k])
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

        static GetQueryString(query) {
            let args = {}
            query = query || location.search.substring(1)
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

        static SetStorage(key, value, time) {
            try {
                time = time || 0;
                localStorage.setItem(key, value)

                if (time > 0) {
                    key += "_Time"
                    var tv = (new Date().getTime() + time * 60 * 1000).toString() + "_" + time.toString()
                    localStorage.setItem(key, tv)
                }
            }
            catch (ex) {
            }
        }

        //获取本地缓存
        static GetStorage(key) {
            var value = ""
            try {
                value = localStorage.getItem(key)
                var tkey = key + "_Time";
                var tvs = localStorage.getItem(tkey)
                if (!Common.IsNullOrEmpty(tvs)) {
                    var vs = tvs.split("_")
                    var tv = parseFloat(vs[0])
                    var time = parseFloat(vs[1])
                    if (tv > 0) {
                        var ct = new Date().getTime()
                        if (ct > tv) {
                            value = ""
                            localStorage.removeItem(key)
                            localStorage.removeItem(tkey)
                        }
                        else {
                            tv = (new Date().getTime() + time * 60 * 1000).toString() + "_" + time.toString()
                            localStorage.setItem(tkey, tv)
                        }
                    }
                }
            }
            catch (ex) {
            }
            return Common.IsNullOrEmpty(value) ? "" : value
        }

        static ClearStorage() {
            localStorage.clear()
        }

        static Split(str, chars) {
            if (Common.IsNullOrEmpty(str)) return []
            str = Common.RemoveWhiteEnter(str);
            let list = []
            let list2 = [str]
            chars.forEach(c => {
                list = list2
                list2 = []
                list.forEach(s => {
                    list2 = list2.concat(s.split(c))
                })
            })
            return list2
        }

        static GetZIndex() {
            Common.ZIndex = Common.ZIndex || 1000;
            Common.ZIndex += 1;
            return Common.ZIndex;
        }

        static ComputeStringWidth(str) {
            if (Common.IsNullOrEmpty(str)) return 0;

            var len = 0;
            var charCode = -1;
            for (var i = 0; i < str.length; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) {
                    len += 1;
                } else {
                    len += 2;
                }
            }
            return len * 6;
        }

        static GetNumberValue(value) {
            if (Common.IsNullOrEmpty(value)) return 0;
            value = value.toString().replace(/,/g, "");
            value = value.replace(/M/g, "");
            var newValue = parseFloat(value);
            return isNaN(newValue) ? 0 : newValue;
        }

        static GetBoolValue(value) {
            if (Common.IsNullOrEmpty(value)) return false;
            let v = value.toString().toLowerCase();
            if (v === "true") return true;
            if (v === "1") return true;
            return false;
        }

        static GetObjectValue(obj, numberNames, boolNames) {
            let data = {};
            if (numberNames && numberNames.length > 0) numberNames.forEach(n => { if (!Common.IsNullOrEmpty(obj[n])) data[n] = Common.GetNumberValue(obj[n]) });
            if (boolNames && boolNames.length > 0) boolNames.forEach(b => data[b] = Common.GetBoolValue(obj[b]));
            for (let key in obj) if (data[key] === undefined) data[key] = obj[key];
            return data;
        }

        static RemoveWhiteEnter(str) {
            str = str.replace(/\n/g, "");
            while (str.indexOf("  ") >= 0) {
                str = str.replace(/  /g, " ");
            }
            return Common.Trim(str);
        }

        static IsFirefox() {
            var reg = new RegExp("firefox");
            return reg.test(navigator.userAgent.toLowerCase());
        }

        static GetCurrentDate(blMillSeconds) {
            var myDate = new Date();
            return blMillSeconds ? Common.GetDateStringByMilliSeconds(myDate) : Common.GetDateString(myDate);
        }

        static GetCurrentDateNumber() {
            var myDate = new Date();
            var year = myDate.getFullYear().toString();
            var month = (myDate.getMonth() + 1);
            month = month < 10 ? "0" + month.toString() : month.toString();
            var day = myDate.getDate();
            day = day < 10 ? "0" + day.toString() : day.toString();
            var hh = myDate.getHours();
            hh = hh < 10 ? "0" + hh.toString() : hh.toString();
            var mm = myDate.getMinutes();
            mm = mm < 10 ? "0" + mm.toString() : mm.toString();
            var ss = myDate.getSeconds();
            ss = ss < 10 ? "0" + ss.toString() : ss.toString();
            var mill = myDate.getMilliseconds();
            mill = mill < 10 ? "00" + mill.toString() : mill < 100 ? "0" + mill.toString() : mill.toString();
            return year + month + day + hh + mm + ss + mill;
        }

        static ConvertToDate(dateString, format) {
            var year, month, day, hh, mm, ss, timeFormat, time, newDate;
            if (format !== undefined) {
                if (format.substring(0, 10) === "yyyy-MM-dd" || format.substring(0, 10) === "yyyy/MM/dd") {
                    year = dateString.substring(0, 4);
                    month = dateString.substring(5, 7);
                    day = dateString.substring(8, 10);
                    newDate = month + "-" + day + "-" + year;
                    if (format.length > 10) timeFormat = Common.Trim(format.substring(10, format.length));
                    if (format.length > 10) time = Common.Trim(dateString.substring(10, dateString.length));
                }
                if (format.substring(0, 10) === "MM-dd-yyyy" || format.substring(0, 10) === "MM/dd/yyyy") {
                    year = dateString.substring(6, 10);
                    month = dateString.substring(0, 2);
                    day = dateString.substring(3, 5);
                    newDate = month + "-" + day + "-" + year;
                    if (format.length > 10) timeFormat = Common.Trim(format.substring(10, format.length));
                    if (format.length > 10) time = Common.Trim(dateString.substring(10, dateString.length));
                }
                if (format.substring(0, 8) === "yyyyMMdd") {
                    year = dateString.substring(0, 4);
                    month = dateString.substring(4, 6);
                    day = dateString.substring(6, 8);
                    newDate = month + "-" + day + "-" + year;
                    if (format.length > 8) timeFormat = Common.Trim(format.substring(8, format.length));
                    if (format.length > 8) time = Common.Trim(dateString.substring(8, dateString.length));
                }
                if (format.substring(0, 8) === "MMddyyyy") {
                    year = dateString.substring(4, 8);
                    month = dateString.substring(0, 2);
                    day = dateString.substring(2, 4);
                    newDate = month + "-" + day + "-" + year;
                    if (format.length > 8) timeFormat = Common.Trim(format.substring(8, format.length));
                    if (format.length > 8) time = Common.Trim(dateString.substring(8, dateString.length));
                }
                if (!Common.IsNullOrEmpty(time) && !Common.IsNullOrEmpty(timeFormat)) {
                    if (!Common.IsNullOrEmpty(timeFormat) && timeFormat === "HH:mm:ss") {
                        hh = time.substring(0, 2);
                        mm = time.substring(3, 5);
                        ss = time.substring(6, 8);
                        newDate += " " + hh + ":" + mm + ":" + ss;
                    }
                    else if (!Common.IsNullOrEmpty(timeFormat) && timeFormat == "HHmmss") {
                        hh = time.substring(0, 2);
                        mm = time.substring(2, 4);
                        ss = time.substring(4, 6);
                        newDate += " " + hh + ":" + mm + ":" + ss;
                    }
                }
                if (!Common.IsNullOrEmpty(newDate)) {
                    dateString = newDate;
                }
            }

            if (Common.IsFirefox()) {
                if (!Common.IsNullOrEmpty(newDate)) {
                    if (!Common.IsNullOrEmpty(time) && !Common.IsNullOrEmpty(timeFormat)) {
                        return new Date(year, month, day, hh, mm, ss);
                    }
                    else {
                        return new Date(year, month, day);
                    }
                }
                else {
                    return new Date(dateString);
                }
            }
            else {
                return new Date(dateString);
            }
        }

        static GetDateString(myDate, isDate) {
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

        static GetDateStringByMilliSeconds(myDate, isDate) {
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
                var mi = myDate.getMilliseconds();
                mi = mi < 10 ? "00" + mi.toString() : mi < 100 ? "0" + mi.toString() : mi.toString();
                return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss + "." + mi;
            }
        }

        static GetYestoday(date) {
            var yesterday_milliseconds = date.getTime() - 1000 * 60 * 60 * 24;
            var yesterday = new Date();
            yesterday.setTime(yesterday_milliseconds);
            var strYear = yesterday.getFullYear();
            var strDay = yesterday.getDate();
            var strMonth = yesterday.getMonth() + 1;
            if (strMonth < 10) {
                strMonth = "0" + strMonth;
            }
            if (strDay < 10) {
                strDay = "0" + strDay;
            }
            return strYear + "-" + strMonth + "-" + strDay;
        }

        static GetLastMonthYestoday(date) {
            var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var strYear = date.getFullYear();
            var strDay = date.getDate();
            var strMonth = date.getMonth() + 1;
            if (strYear % 4 === 0 && strYear % 100 !== 0) {
                daysInMonth[1] = 29;
            }
            if (strMonth - 1 === 0) {
                strYear -= 1;
                strMonth = 12;
            }
            else {
                strMonth -= 1;
            }
            strDay = daysInMonth[strMonth - 1] >= strDay ? strDay : daysInMonth[strMonth - 1];
            if (strMonth < 10) {
                strMonth = "0" + strMonth;
            }
            if (strDay < 10) {
                strDay = "0" + strDay;
            }
            return strYear + "-" + strMonth + "-" + strDay;
        }

        static ToLogin() {
            window.location.href = "Index.aspx";
        }

        static AddURLParameter(url, name, value) {
            if (url.indexOf("?") > 0) {
                return url += "&" + name + "=" + escape(value);
            }
            else {
                return url += "?" + name + "=" + escape(value);
            }
        }

        //判断输入文本框是否是Decimal类型数值
        static IsDecimal(value) {
            var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d+)?$");
            return reg.test(value);
        }

        //判断输入文本框是否是输入一位小数的浮点数
        static IsDecimal1(value) {
            var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$");
            return reg.test(value);
        }

        //判断输入文本框是否是输入两位小数的浮点数
        static IsDecimal2(value) {
            var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$|^(-?\\d+)(\\.\\d{2})?$");
            return reg.test(value);
        }

        //判断输入文本框是否是输入三位小数的浮点数
        static IsDecimal3(value) {
            var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$|^(-?\\d+)(\\.\\d{2})?$|^(-?\\d+)(\\.\\d{3})?$");
            return reg.test(value);
        }

        //判断输入文本框是否是输入四位小数的浮点数
        static IsDecimal4(value) {
            var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$|^(-?\\d+)(\\.\\d{2})?$|^(-?\\d+)(\\.\\d{3})?$|^(-?\\d+)(\\.\\d{4})?$");
            return reg.test(value);
        }

        //判断只能输入数字、小数点、负数(-)
        static IsDecimalCharCode(e) {
            var key = window.event ? e.keyCode : e.which;
            var keychar = String.fromCharCode(key);
            var reg = new RegExp("\\d|\\.|\\-");
            return reg.test(keychar);
        }

        //判断只能输入数字
        static IsNumberCharCode(e) {
            var key = window.event ? e.keyCode : e.which;
            var keychar = String.fromCharCode(key);
            var reg = new RegExp("\\d|\\-");
            return reg.test(keychar);
        }

        //判断只能输入自然数
        static IsNaturalNumberCharCode(e) {
            var key = window.event ? e.keyCode : e.which;
            var keychar = String.fromCharCode(key);
            var reg = new RegExp("\\d");
            return reg.test(keychar);
        }

        //判断输入文本框是否是整数
        static IsNumber(value) {
            var reg = new RegExp("^-?\\d+$");
            return reg.test(value);
        }

        static ToCurrency(value, blFixed2) {
            blFixed2 = blFixed2 === undefined ? true : blFixed2
            var floatValue = isNaN(value) ? parseFloat(value) : value
            if (isNaN(floatValue)) {
                return value
            }
            else {
                var flString = blFixed2 ? floatValue.toFixed(2) : floatValue.toString()
                var r = /(\d+)(\d{3})/
                while (r.test(flString)) {
                    flString = flString.replace(r, "$1" + ',' + '$2')
                }
                return flString
            }
        }

        static ReplaceHtmlTag(str) {
            if (!str) return "";
            if (typeof (str) !== "string") return str;
            str = str.replace(/</g, "&lt;");
            return str.replace(/>/g, "&gt;");
        }

        static Assign(a, b, c) {
            if (!Common.IsObject(a)) return a

            const objList = []
            if (Common.IsObject(b)) for (let k in b) a[k] = Common.Clone(b[k], objList)

            if (Common.IsObject(c)) for (let k in c) a[k] = Common.Clone(c[k], objList)

            return a
        }

        static ArrayClone(a, objList) {
            if (!Common.IsArray(a)) return a

            var dataList = []
            for (var i = 0; i < a.length; i++) {
                dataList.push(Common.Clone(a[i], objList))
            }
            return dataList
        }

        static Clone(a, objList) {
            if (Common.IsArray(a)) return Common.ArrayClone(a, objList)

            if (!Common.IsObject(a)) return a

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
                if (Common.IsArray(a[key])) {
                    c[key] = Common.ArrayClone(a[key], objList)
                }
                else if (Common.IsObject(a[key])) {
                    c[key] = Common.Clone(a[key], objList)
                }
                else {
                    c[key] = a[key]
                }
            }

            return c
        }

        static IsGuid(value) {
            if (Common.IsNullOrEmpty(value)) return false;
            if (typeof value !== "string") return false;

            value = value.toUpperCase();
            var reg = new RegExp("^[A-F0-9]{8}(-[A-F0-9]{4}){3}-[A-F0-9]{12}$");

            return reg.test(value);
        }
    }

    Object.assign = Object.assign || Common.Assign

})($ns);
((ns) => {
    const { Common } = ns.utils

    ns.utils.HtmlTag = class HtmlTag {

        static GetById(id) {
            return document.getElementById(id)
        }

        static SetHtml(ele, html) {
            if (ele && html !== undefined) {
                ele.innerHTML = html
            }
        }

        static BindEvent(ele, eventName, fn, blUnbind) {
            if (!ele) return;

            let eventNames = eventName.split(".");
            let name = "";
            if (eventNames.length === 2) {
                eventName = eventNames[0];
                name = eventNames[1];
            }
            else {
                name = eventName;
            }

            if (ele["Event_" + eventName] === undefined) {
                ele["Event_" + eventName] = {
                    EventAction: (e) => {
                        let rv = true, rv2 = null
                        eventObj.EventList.forEach(ev => { rv2 = ev.Action(e); if (rv2 === false) rv = rv2; })
                        if (rv === false) { e.preventDefault(); e.returnValue = rv; e.cancel = !rv; }
                    },
                    EventList: []
                };
            }

            let eventObj = ele["Event_" + eventName];

            if (blUnbind) {
                if (eventObj.EventList.length === 1) {
                    HtmlTag.RemoveEvent(ele, eventName, eventObj.EventAction)
                    eventObj.EventList = [];
                }
                else {
                    let index = -1;
                    for (let i = 0; i < eventObj.EventList.length; i++) {
                        if (eventObj.EventList[i].Name === name) { index = i; break; }
                    }
                    if (index >= 0) eventObj.EventList.splice(index, 1);
                }
            }
            else {
                let list = eventObj.EventList.filter(f => f.Name === name);
                list.length === 0 && eventObj.EventList.push({ Name: name, Action: fn });

                if (eventObj.EventList.length === 1) HtmlTag.AddEvent(ele, eventName, eventObj.EventAction);
            }
        }

        static OffBindEvent(ele, eventName) {
            HtmlTag.BindEvent(ele, eventName, null, true);
        }

        static AddEvent(ele, eventName, fn) {
            if (ele.addEventListener) {
                ele.addEventListener(eventName, fn, false)
            }
            else if (ele.attachEvent) {
                ele.attachEvent('on' + eventName, fn)
            }
            else {
                ele["on" + eventName] = fn
            }
        }

        static RemoveEvent(ele, eventName, fn) {
            if (ele.detachEvent) {
                ele.detachEvent('on' + eventName, fn)
            }
            else if (ele.removeEventListener) {
                ele.removeEventListener(eventName, fn, false)
            }
            else {
                ele["on" + eventName] = null
            }
        }

        static SetAttribute(ele, name, value) {
            ele && ele.setAttribute && ele.setAttribute(name, value);
        }

        static GetAttribute(ele, name) {
            if (ele && ele.getAttribute) return ele.getAttribute(name)
            return null
        }

        static GetElement(ele) {
            return typeof (ele) === "string" ? HtmlTag.GetById(ele) : ele
        }

        static GetValue(ele) {
            ele = HtmlTag.GetElement(ele)
            if (ele && ele.value) return Common.Trim(ele.value);
            return ""
        }

        static SetValue(ele, value) {
            ele = HtmlTag.GetElement(ele)
            if (ele) ele.value = value
        }

        static SetDisabled(ele, disabled) {
            ele = HtmlTag.GetElement(ele)
            if (ele) ele.disabled = disabled
        }

        static GetDisabled(ele) {
            ele = HtmlTag.GetElement(ele)
            if (ele) return ele.disabled
            return false
        }

        static Find(ele, tags) {
            if (!ele || !tags || !ele.hasChildNodes()) return null

            let tagList = tags.split(">")
            const tagName = tagList[0]
            tagList.splice(0, 1)

            let childList = []

            let c = null;
            for (let i = 0; i < ele.childNodes.length; i++) {
                c = ele.childNodes[i];
                if (c.nodeName.toLowerCase() === tagName.toLowerCase()) childList.push(c);
            }

            if (tagList.length > 0) {
                tags = tagList.join(">")
                let childList2 = [], list = null

                childList.forEach((c) => {
                    list = HtmlTag.Find(c, tags)
                    if (list != null) childList2 = childList2.concat(list)
                })

                return childList2
            }
            else {
                return childList
            }
        }

        static AppendHtml(ele, html) {
            var div = document.createElement("div")
            HtmlTag.SetHtml(div, html)
            while (div.childNodes.length > 0) {
                ele.appendChild(div.childNodes[0])
            }
        }

        static GetElementsByTagName(ele, tagName) {
            return ele && ele.getElementsByTagName(tagName);
        }

        static SetHide(ele) {
            if (ele && ele.style) ele.style.display = "none"
        }

        static SetShow(ele) {
            if (ele && ele.style) ele.style.display = ""
        }

        static GetBodyWidth() {
            return document.body.offsetWidth
        }

        static GetWindowWidth() {
            return window.screen.availWidth;
        }

        static GetBodyHeight() {
            return document.body.offsetHeight
        }

        static GetWindowHeight() {
            return window.screen.availHeight;
        }

        static GetWindowWidth() {
            return window.innerWidth
        }

        static GetWindowHeight() {
            return window.innerHeight
        }

        static GetWidth(ele) {
            if (ele && ele.style) {
                if (ele.style.width === "") {
                    return ele.parentNode !== null ? HtmlTag.GetWidth(ele.parentNode) : HtmlTag.GetBodyWidth()
                }
                else if (ele.style.width.indexOf("%") > 0) {
                    return HtmlTag.GetWidth(ele.parentNode) * parseFloat(ele.style.width) / 100
                }
                else {
                    return parseFloat(ele.style.width)
                }
            }
            return ele.body ? HtmlTag.GetBodyWidth() : 0
        }

        static SetWidth(ele, width) {
            if (ele && ele.style) {
                let w = parseFloat(width);
                if (!isNaN(w)) ele.style.width = w.toString() + "px"
            }
        }

        static GetHeight(ele) {
            if (ele && ele.style) {
                if (ele.style.height === "") {
                    return ele.parentNode !== null ? HtmlTag.GetHeight(ele.parentNode) : HtmlTag.GetBodyHeight()
                }
                else if (ele.style.height.indexOf("%") > 0) {
                    return HtmlTag.GetHeight(ele.parentNode) * parseFloat(ele.style.height) / 100
                }
                else {
                    return parseFloat(ele.style.height)
                }
            }
            return ele.body ? HtmlTag.GetBodyHeight() : 0
        }

        static SetHeight(ele, height) {
            if (ele && ele.style) {
                let w = parseFloat(height);
                if (!isNaN(w)) ele.style.height = w.toString() + "px"
            }
        }

        static SetStyle(ele, style) {
            if (ele && ele.style && style) {
                for (var key in style) {
                    ele.style[key] = style[key]
                }
            }
        }

        static SetStyleValue(ele, key, value) {
            if (ele && ele.style) {
                ele.style[key] = value
            }
        }

        static RemoveClass(ele, className) {
            if (ele && ele.className !== undefined) {
                ele.className = Common.Trim(ele.className.replace(new RegExp(className, "g"), "").replace(new RegExp("  ", "g"), ""))
            }
        }

        static AddClass(ele, className) {
            if (ele && ele.className !== undefined) {
                let cn = Common.Trim(ele.className).replace(new RegExp(className, "g"), "").replace(new RegExp("  ", "g"), "")
                cn = cn + " " + className
                ele.className = Common.Trim(cn)
            }
        }

        static RemoveElement(parentNode, ele) {
            if (parentNode && ele && parentNode.removeChild && parentNode.hasChildNodes) {
                if (parentNode.contains) {
                    parentNode.contains(ele) && parentNode.removeChild(ele);
                }
                else {
                    let blExists = false;
                    for (let i = 0; i < parentNode.childNodes.length; i++) {
                        if (parentNode.childNodes[i] === ele) {
                            blExists = true;
                            break;
                        }
                    }
                    if (blExists) parentNode.removeChild(ele);
                }
            }
        }

        static GetOffSet(ele) {
            if (ele) {
                let topLeft = HtmlTag.GetTopLeft(ele.parentNode)

                return {
                    top: ele.offsetTop + topLeft.top,
                    left: ele.offsetLeft + topLeft.left,
                    width: ele.offsetWidth,
                    height: ele.offsetHeight
                }
            }
            return null
        }

        static GetTopLeft(ele, topLeft) {
            topLeft = topLeft || { top: 0, left: 0 };
            if (ele && HtmlTag.GetStyleValue(ele, "position") === "absolute") {
                topLeft = {
                    top: topLeft.top + parseFloat(ele.style.top),
                    left: topLeft.left + parseFloat(ele.style.left)
                }
                return topLeft;
            }
            else if (ele && ele !== document.body) {
                return HtmlTag.GetTopLeft(ele.parentNode, topLeft);
            }

            return topLeft;
        }

        static GetStyleValue(ele, name) {
            if (!ele) return "";
            if (ele.style && ele.style[name]) return ele.style[name];
            let styles = HtmlTag.GetStyles(ele);
            if (styles && styles[name]) return styles[name];
            return "";
        }

        static ComputeStringWidth(str) {
            if (Common.IsNullOrEmpty(str)) return 0;

            HtmlTag.SpanId = HtmlTag.SpanId || Common.CreateGuid();
            let span = HtmlTag.GetById(HtmlTag.SpanId);
            if (span === null) {
                span = document.createElement("span");
                span.id = HtmlTag.SpanId;
                span.style.visibility = "hidden";
                document.body.appendChild(span)
            }
            span.innerHTML = "";
            let width = span.offsetWidth;
            span.innerHTML = str;
            width = span.offsetWidth - width;
            span.innerHTML = "";
            return width;
        }

        static GetStyles(ele) {
            if (!ele) return null;
            if (ele.ownerDocument) return ele.ownerDocument.defaultView.getComputedStyle(ele);
            else if (ele.currentStyle) return ele.currentStyle;
            return null;
        }

    }

})($ns);
((ns) => {
    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    function safeAdd(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF)
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return (msw << 16) | (lsw & 0xFFFF)
    }

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    function bitRotateLeft(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
    }

    /*
    * These functions implement the four basic operations the algorithm uses.
    */
    function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
    }
    function md5ff(a, b, c, d, x, s, t) {
        return md5cmn((b & c) | ((~b) & d), a, b, x, s, t)
    }
    function md5gg(a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & (~d)), a, b, x, s, t)
    }
    function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t)
    }
    function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | (~d)), a, b, x, s, t)
    }

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    function binlMD5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32)
        x[(((len + 64) >>> 9) << 4) + 14] = len

        var i
        var olda
        var oldb
        var oldc
        var oldd
        var a = 1732584193
        var b = -271733879
        var c = -1732584194
        var d = 271733878

        for (i = 0; i < x.length; i += 16) {
            olda = a
            oldb = b
            oldc = c
            oldd = d

            a = md5ff(a, b, c, d, x[i], 7, -680876936)
            d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
            c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
            b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
            a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
            d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
            c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
            b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
            a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
            d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
            c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
            b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
            a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
            d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
            c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
            b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

            a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
            d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
            c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
            b = md5gg(b, c, d, a, x[i], 20, -373897302)
            a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
            d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
            c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
            b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
            a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
            d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
            c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
            b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
            a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
            d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
            c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
            b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

            a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
            d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
            c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
            b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
            a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
            d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
            c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
            b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
            a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
            d = md5hh(d, a, b, c, x[i], 11, -358537222)
            c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
            b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
            a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
            d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
            c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
            b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

            a = md5ii(a, b, c, d, x[i], 6, -198630844)
            d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
            c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
            b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
            a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
            d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
            c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
            b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
            a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
            d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
            c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
            b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
            a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
            d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
            c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
            b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

            a = safeAdd(a, olda)
            b = safeAdd(b, oldb)
            c = safeAdd(c, oldc)
            d = safeAdd(d, oldd)
        }
        return [a, b, c, d]
    }

    /*
    * Convert an array of little-endian words to a string
    */
    function binl2rstr(input) {
        var i
        var output = ''
        var length32 = input.length * 32
        for (i = 0; i < length32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
        }
        return output
    }

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    function rstr2binl(input) {
        var i
        var output = []
        output[(input.length >> 2) - 1] = undefined
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0
        }
        var length8 = input.length * 8
        for (i = 0; i < length8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
        }
        return output
    }

    /*
    * Calculate the MD5 of a raw string
    */
    function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
    }

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    function rstrHMACMD5(key, data) {
        var i
        var bkey = rstr2binl(key)
        var ipad = []
        var opad = []
        var hash
        ipad[15] = opad[15] = undefined
        if (bkey.length > 16) {
            bkey = binlMD5(bkey, key.length * 8)
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636
            opad[i] = bkey[i] ^ 0x5C5C5C5C
        }
        hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
        return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
    }

    /*
    * Convert a raw string to a hex string
    */
    function rstr2hex(input) {
        var hexTab = '0123456789abcdef'
        var output = ''
        var x
        var i
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i)
            output += hexTab.charAt((x >>> 4) & 0x0F) +
                hexTab.charAt(x & 0x0F)
        }
        return output
    }

    /*
    * Encode a string as utf-8
    */
    function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input))
    }

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    function rawMD5(s) {
        return rstrMD5(str2rstrUTF8(s))
    }
    function hexMD5(s) {
        return rstr2hex(rawMD5(s))
    }
    function rawHMACMD5(k, d) {
        return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
    }
    function hexHMACMD5(k, d) {
        return rstr2hex(rawHMACMD5(k, d))
    }

    function md5(string, key, raw) {
        if (!key) {
            if (!raw) {
                return hexMD5(string)
            }
            return rawMD5(string)
        }
        if (!raw) {
            return hexHMACMD5(key, string)
        }
        return rawHMACMD5(key, string)
    }

    ns.utils.Common.ComputeMd5 = function (string, key, raw) {
        return md5(string, key, raw).toUpperCase()
    };

})($ns);
((ns) => {
    const { Common } = ns.utils

    ns.api.Index = class Index {
        constructor(options) {
            this.Id = Common.CreateGuid()

            options && Object.assign(this, options)
        }

        PostFetch(url, data) {
            return fetch(this.GetFullUrl(url, data), {
                method: "POST",
                body: JSON.stringify(data)
            }).then(res => this.SetResult(res).then(d => this.GetResponse(d)))
        }

        PostStreamFetch(url, data) {
            return fetch(Common.AddUrlRandom(url), {
                method: "POST",
                headers: { "Content-Type": "application/octet-stream" },
                body: data
            }).then(res => this.SetResult(res).then(d => this.GetResponse(d)))
        }

        GetResponse(res) {
            if (res && res.Ack) {
                if (res.Ack.IsSuccess) {
                    return Promise.resolve(res.Data)
                }
                else if (res.Ack.StatusMessage) {
                    return Promise.reject(res.Ack.StatusMessage)
                }
            }

            return Promise.reject("请求异常！")
        }

        SetResult(res) {
            return res.ok ? res.json() : Promise.reject(res.status + ":" + (!res.statusText ? "请求错误！" : res.statusText))
        }

        GetFullUrl(url, data) {
            url = this.GetRootPath() + url
            if (data.EntityName === "UserLogin") {
                data.EntityName = "User";
                url = Common.AddURLParameter(url, "IsLogin", "true");
            }
            else {
                let userId = Common.GetStorage("LoginUserId");
                if (!userId) Common.ToLogin();
                url = Common.AddURLParameter(url, "LoginUserId", userId);
            }
            return Common.AddUrlRandom(url)
        }

        GetRootPath() {
            return "api/"
        }

    }

})($ns);
((ns) => {
    const { Index } = ns.api

    ns.api.DataAccess = class DataAccess extends Index {
        constructor(options) {
            super(options)
        }

        Request(type, entityName, request) {
            const data = {
                EntityName: entityName,
                Request: request
            }
            return this.PostFetch(`DataAccess/${type}`, data)
        }

        Query(entityName, request) {
            return this.Request("Query", entityName, request)
        }

        Create(entityName, request) {
            return this.Request("Create", entityName, request)
        }

        Update(entityName, request) {
            return this.Request("Update", entityName, request)
        }

        Delete(entityName, request) {
            return this.Request("Delete", entityName, request)
        }
    }

})($ns);
((ns) => {
    const StatePool = [], ConnectPool = [], StateData = {}

    ns.data.Index = class Index {

        static AddStatePool(state) {
            Index.SetState(state)
            StatePool.push(state)
        }

        static SetState(state, action) {
            for (let key in state) {
                StateData[key] = state[key](StateData[key], action)
            }
        }

        static GetState() {
            return StateData
        }

        static Dispatch(action) {
            StatePool.forEach((s) => Index.SetState(s, action))
            ConnectPool.forEach((c) => c(StateData))
        }

        static Connect(c) {
            c(StateData)
            ConnectPool.push(c)
        }

        static GetStateValue(state, key, name, currentValue) {
            if (state[key]) {
                const value = state[key][name]
                if (currentValue !== value) { return Promise.resolve(value) }
            }
            return Promise.resolve(null)
        }
    }

})($ns);
((ns) => {

    ns.data.Index.InitListPageEntityState = (key) => {
        const sp = {}

        const initialState = {
            QueryResponse: null,
            DeleteResponse: null,
            ListEditResponse: null
        }

        sp[key] = (state, action) => {
            if (!action) return initialState
            switch (action.type) {
                case `${key}_Search_Data`:
                    state.QueryResponse = action.data
                    return state
                case `${key}_Delete`:
                    state.DeleteResponse = action.data
                    return state
                case `${key}_Update`:
                    state.ListEditResponse = action.data
                    return state
                default:
                    return state
            }
        }

        ns.data.Index.AddStatePool(sp)
    }

})($ns);
((ns) => {

    ns.data.Index.InitEditPageEntityState = (key) => {
        const sp = {}

        const initialState = {
            EditResponse: null
        }

        sp[key] = (state, action) => {
            if (!action) return initialState
            switch (action.type) {
                case `${key}_Create`:
                case `${key}_Update`:
                    state.EditResponse = action.data
                    return state
                default:
                    return state
            }
        }

        ns.data.Index.AddStatePool(sp)
    }

})($ns);
((ns) => {
    const { Common } = ns.utils

    ns.data.Cache = class Cache {

        static GetDataList(cacheName, entityName, selectNames, conditions) {
            let data = Cache.GetCache(cacheName)
            if (data) return Promise.resolve(data)

            let indexAction = new ns.actions.Index(Cache)
            return indexAction.GetDataList(entityName, selectNames, conditions).then(res => {
                if (res.IsSuccess) {
                    Cache.SetCache(cacheName, entityName, selectNames, conditions, res.Data.DataList)
                    return Promise.resolve(res.Data.DataList)
                }
                else return Promise.resolve(null)
            })
        }

        static GetCache(cacheName) {
            const dataString = Common.GetStorage(cacheName)
            if (!Common.IsNullOrEmpty(dataString)) return JSON.parse(dataString)
            return null
        }

        static SetCache(cacheName, entityName, selectNames, conditions, data) {
            Cache.CacheList = Cache.CacheList || Cache.GetCacheList();
            var list = Cache.CacheList.filter(f => f.CacheName === cacheName);
            if (list.length === 0) Cache.CacheList.push({
                CacheName: cacheName, EntityName: entityName,
                SelectNames: selectNames, Conditions: conditions
            });

            Common.SetStorage("$CacheConfigList", JSON.stringify(Cache.CacheList))

            Common.SetStorage(cacheName, JSON.stringify(data))
        }

        static GetCacheList() {
            return Cache.GetCache("$CacheConfigList") || [];
        }

        static UpdateEntityCacheList(entityName) {
            Cache.CacheList = Cache.CacheList || Cache.GetCacheList();
            let list = Cache.CacheList.filter(f => f.EntityName === entityName);
            list.forEach(c => {
                Common.SetStorage(c.CacheName, "");
                Cache.GetDataList(c.CacheName, c.EntityName, c.SelectNames, c.Conditions);
            })
        }

        static GetPropertyDataList(p) {
            if (!p.DataSource) return;
            const { CacheName, EntityName, SelectNames, Conditions, TextName, ValueName } = p.DataSource;
            p.ValueName = ValueName;
            p.TextName = TextName;
            let cacheName = CacheName || EntityName;
            let condtions = Conditions || [];

            return Cache.GetDataList(cacheName, EntityName, SelectNames, condtions).then(res => {
                p.DataList = res ? res : [];
                let names = Common.Split(p.TextName, [",", ";", "，", "；"]);
                if (names.length > 1) {
                    let text = [];
                    p.DataList.forEach(d => {
                        text = [];
                        names.forEach(n => text.push(Common.IsNullOrEmpty(d[n]) ? "" : d[n]));
                        d[p.TextName] = text.join("/");
                    })
                }
                if (p.ExpandSetDataList) p.DataList = p.ExpandSetDataList(p.DataList, ns);
                return Promise.resolve()
            });
        }
    }

})($ns);
((ns) => {
    const { Common } = ns.utils
    const { DataAccess } = ns.api
    const { Dispatch, GetStateValue } = ns.data.Index

    ns.actions.Index = class Index {
        constructor(target) {
            this.Id = Common.CreateGuid()
            this.EventNames = ["click"]
            this.Target = target

            this.Api = new DataAccess()
        }

        Invoke(e, c) { }

        DispatchAction(apiAction) {
            return (dispatch, type, setResult) =>
                apiAction().then(res => {
                    setResult && setResult(res)
                    dispatch && dispatch({ type: type, data: res })
                    return Promise.resolve({ IsSuccess: true, Data: res })
                }, res => {
                    const msg = res && res.message ? res.message : res
                    dispatch && dispatch({ type: type, data: { ActionFailedMessage: msg } })
                    return Promise.resolve({ IsSuccess: false, Message: msg })
                })
        }

        Edit(c, blUpdate) {
            const { Entity, EditDialog } = this.Target

            let editData = this.Target.GetEditData()
            if (editData === false) return

            if (c.Type === 2) editData.DataStatus = 1;

            if (this.Target.IsLocalData) {
                if (!blUpdate) editData[this.Target.Entity.PrimaryKey] = Common.CreateGuid()
                this.Target.SaveData(editData)
                this.Target.ClearControlValue()
                EditDialog.Close()
                return
            }

            this.EditEntityData(c, [editData], blUpdate, this.Target)
        }

        EditEntityData(c, dataList, blUpdate, editPage) {
            c.SetDisabled(true);
            const { Entity, KeyName, EditDialog } = editPage

            const request = { Data: dataList }

            const name = blUpdate ? "Update" : "Create"
            this.DispatchAction(() => this.Api[name](Entity.Name, request))(Dispatch, KeyName + "_" + name).then(res => {
                if (res.IsSuccess) {
                    Common.Alert("操作成功！").then(() => {
                        editPage.ClearControlValue()
                        EditDialog.Close()
                    })
                    ns.data.Cache.UpdateEntityCacheList(Entity.Name);
                }
                else {
                    Common.Alert(res.Message).then(() => c.SetDisabled(false))
                }
            })
        }

        EditData(entityName, data, blUpdate) {
            const name = blUpdate ? "Update" : "Create"
            const request = { Data: data }

            return this.DispatchAction(() => this.Api[name](entityName, request))();
        }

        GetDataValue(state, keyName, name) {
            return GetStateValue(state, keyName, name, this[name]).then((v) => {
                if (v != null) { this[name] = v }
                return Promise.resolve(v != null)
            })
        }

        GetDataList(entityName, selectNames, conditions) {
            const request = {
                SelectNames: selectNames,
                Conditions: conditions
            }

            return this.DispatchAction(() => this.Api.Query(entityName, request))()
        }

        GetEntityData(entity, selectNames, id) {
            const request = {
                IsRowVersion: true,
                SelectNames: selectNames,
                Conditions: [{ Name: entity.PrimaryKey, Logic: "=", Value: id }]
            }

            if (entity.ComplexQueryList && entity.ComplexQueryList.length > 0) {
                request.ComplexQueryList = []
                entity.ComplexQueryList.forEach(c => {
                    request.ComplexQueryList.push(Object.assign({
                        Conditions: [{ Name: entity.PrimaryKey, Logic: "=", Value: id }]
                    }, c))
                })
            }

            return this.DispatchAction(() => this.Api.Query(entity.Name, request))()
        }

        GetEditText(rowData) {
            const { IsDataRight, LoginUser } = this.DataGrid
            if (IsDataRight) {
                if (LoginUser && rowData.CreateUser === LoginUser.UserId) return this.Label;
                return "";
            }
            return this.Label;
        }

    }

})($ns);
((ns) => {
    const { Index } = ns.actions
    const { Common, HtmlTag } = ns.utils
    const { Dispatch, Connect } = ns.data.Index

    ns.actions.SearchAction = class SearchAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = this.Label || "查询"
            this.PageIndex = this.PageIndex || 1
            this.ConditionList = this.ConditionList || []
            this.InitConditionList = this.InitConditionList || []

            this.Init()
        }

        GetConditionList() {
            this.ConditionList = this.Page.GetSearchCondition()
            return this.ConditionList
        }

        Invoke(e, c) {
            this.PageIndex = 1
            this.Search(e, c, false)
        }

        Search(e, c, p, ids) {
            const { Entity, SelectNames, IsPage, PageSize, KeyName, IsDataRight, IsDataStatus } = this.Page
            if (!p) this.GetConditionList()

            if (this.ConditionList === false) return;

            if (this.DataStatus) this.ConditionList.push({ Name: "DataStatus", Logic: "=", Value: this.DataStatus })

            if (Entity.IsSelectKey) SelectNames.splice(0, 0, Entity.PrimaryKey)
            let request = {
                IsPage: IsPage,
                IsRowVersion: Entity.IsRowVersion === undefined ? true : Entity.IsRowVersion,
                IsDataRight: IsDataRight,
                IsDataStatus: IsDataStatus,
                PageIndex: this.PageIndex,
                PageSize: PageSize,
                SelectNames: SelectNames,
                Conditions: this.ConditionList,
                OrderBys: this.Page.GetOrderByList()
            }

            if (Entity.ExpandQueryRequest) request = Entity.ExpandQueryRequest.call(this, request, ns);
            if (request === false) return;

            let loading = new ns.components.Loading();
            loading.Show();

            this.DispatchAction(() => this.Api.Query(Entity.Name, request))(Dispatch, KeyName + "_Search_Data", (res) => {
                if (ids) res.Ids = ids
            }).then(res => {
                if (res.IsSuccess && res.Data.PageRecord >= 0) this.PageRecord = res.Data.PageRecord
                loading.Close();
            })
        }

        Init() {
            const { Entity } = this.Page

            Connect(state => {
                let keyName = "EditPage_" + Entity.Id

                this.GetDataValue(state, keyName, "EditResponse").then(res => {
                    res && this.SetEditResponse(this.EditResponse)
                })

                keyName = "ListPage_" + Entity.Id

                this.GetDataValue(state, keyName, "ListEditResponse").then(res => {
                    res && this.SetEditResponse(this.ListEditResponse)
                })

                this.GetDataValue(state, this.Page.KeyName, "DeleteResponse").then(res => {
                    res && this.SetDeleteResponse()
                })
            })
        }

        SetEditResponse(res) {
            if (res == null) { return }

            if (res.Ids) {
                if (res.RequestType === "Create") this.InsertRefresh()
                this.Search(null, null, true, res.Ids)
            }
        }

        InsertRefresh() {
            this.Page.SetInitConditionList(this.InitConditionList)
            this.ConditionList = this.InitConditionList.map(c => c)
        }

        ExcelRefresh() {
            this.InsertRefresh()
            this.Search(null, null, true)
        }

        SetDeleteResponse() {
            let res = this.DeleteResponse
            if (res == null) { return }

            const { RowCount } = this.Page.DataGridComponent
            if (res.IsDelete) {
                if (res.RowCount === RowCount && this.PageIndex > 1) this.PageIndex -= 1
                this.Search(null, null, true)
            }
        }
    }

    ns.actions.NewAddAction = class NewAddAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = "新增"
        }

        Invoke(e, c) {
            new ns.pages.EditPage({ Entity: this.Page.Entity, IsDataStatus: this.Page.IsDataStatus }).Load()
        }
    }

    ns.actions.EditAction = class EditAction extends Index {
        constructor(dataGrid) {
            super(dataGrid)

            this.DataGrid = dataGrid
            this.Label = "修改"
        }

        GetText(rowData) {
            if (this.DataGrid.IsDataStatus && rowData.DataStatus === 1) {
                return "查看"
            }
            return this.GetEditText(rowData);
        }

        IsLook(rowData) {
            if (this.DataGrid.IsDataStatus && rowData.DataStatus === 1) {
                return true;
            }
            return false;
        }

        Invoke(e, c) {
            new ns.pages.EditPage({
                Entity: this.DataGrid.Entity,
                IsLocalData: this.DataGrid.IsLocalData,
                SaveData: (d) => this.DataGrid.SaveData(d),
                RowData: c.RowData,
                IsDataStatus: this.DataGrid.IsDataStatus,
                IsLook: this.IsLook(c.RowData),
                IsUpdate: true
            }).Load()
        }
    }

    ns.actions.UpdateStatusAction = class UpdateStatusAction extends Index {
        constructor(dataGrid) {
            super(dataGrid)

            this.DataGrid = dataGrid
            this.Label = ""
        }

        GetText(rowData) {
            let s = rowData.DataStatus;
            const { IsDataRight, LoginUser } = this.DataGrid
            if (IsDataRight) {
                if (!LoginUser) return "";
                let r = LoginUser.DataRight || 1;

                if (rowData.CreateUser === LoginUser.UserId && (s === 0 || s === 2)) return "提交";
                if (r === 3 && s === 1) return "驳回";
            }
            return "";
        }

        Invoke(e, c) {
            let s = c.RowData.DataStatus;
            if (s === 1) return this.Reject(e, c);

            (s === 0 || s === 2) && Common.Confirm("确认提交吗？").then(() => {
                const { Entity, RowCount, KeyName } = this.DataGrid

                let data = {}
                data[Entity.PrimaryKey] = c.RowData[Entity.PrimaryKey]
                data.DataStatus = 1;
                data.RowVersion = c.RowData.RowVersion

                const request = { Data: [data] }

                this.DispatchAction(() => this.Api.Update(Entity.Name, request))(Dispatch, KeyName + "_Update").then(res => {
                    if (!res.IsSuccess) Common.Alert(res.Message)
                })
            });
        }

        Reject(e, c) {
            new ns.pages.EditPage({
                Entity: this.GetRejectEntity(),
                SaveData: (d) => this.DataGrid.SaveData(d),
                RowData: c.RowData,
                IsUpdate: true,
                Title: "驳回" + this.DataGrid.Entity.Label
            }).Load()
        }

        GetRejectEntity() {
            const { Entity, RowCount, KeyName } = this.DataGrid

            return {
                Id: Entity.Id,
                Name: Entity.Name,
                Label: Entity.Label,
                PrimaryKey: Entity.PrimaryKey,
                IsSelectKey: true,
                Properties: [{
                    Name: "RejectReason",
                    Label: "驳回原因",
                    ControlType: "TextArea",
                    MaxLength: 500,
                    IsNullable: false,
                    EditOptions: {
                        X: 1,
                        Y: 1,
                        ControlWidth: 450,
                        Height: 80
                    }
                },
                {
                    Name: "DataStatus",
                    EditOptions: {
                        IsVisible: false
                    }
                }],
                ExpandSetEditData: (data, blUpdate, ns2) => {
                    data.DataStatus = 2;

                    this.CreateRejectReason(data.RejectReason, data[Entity.PrimaryKey])

                    return data
                }
            }
        }

        CreateRejectReason(rejectReason, id) {
            let data = {}
            data.DataId = Common.CreateGuid();
            data.RejectDataId = id;
            if (this.DataGrid.LoginUser) data.UserName = this.DataGrid.LoginUser.UserName + "(" + this.DataGrid.LoginUser.LoginName + ")"
            data.RejectReason = rejectReason

            const request = { Data: [data] }

            this.DispatchAction(() => this.Api.Create("RejectRecord", request))();
        }
    }

    ns.actions.BatchSubmitAction = class BatchSubmitAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = "批量提交"
            this.Width = 80
        }

        Invoke(e, c) {
            const dataList = this.Page.GetDataGridCheckedValue();
            if (dataList.length === 0) {
                Common.Alert("请选择数据行！");
                return;
            }

            let dataList2 = [], dataList3 = [];

            const { IsDataRight, LoginUser } = this.Page
            if (IsDataRight) {
                dataList.forEach(d => {
                    if (LoginUser && d.CreateUser === LoginUser.UserId) dataList2.push(d);
                })
            }
            else dataList2 = dataList;

            if (this.Page.IsDataStatus) {
                dataList2.forEach(d => {
                    if (d.DataStatus !== 1) dataList3.push(d);
                })
            }
            else dataList3 = dataList2;

            if (dataList3.length === 0) {
                Common.Alert("对不起，选择的数据行未有符合可提交的数据！");
                return;
            }

            Common.Confirm("确认提交吗？").then(() => {
                const { Entity, KeyName } = this.Page

                let data = {}, dataList4 = [];

                dataList3.forEach(d => {
                    data = {}
                    data[Entity.PrimaryKey] = d[Entity.PrimaryKey]
                    data.DataStatus = 1;
                    data.RowVersion = d.RowVersion

                    dataList4.push(data);
                });
                const request = { Data: dataList4 }

                this.DispatchAction(() => this.Api.Update(Entity.Name, request))(Dispatch, KeyName + "_Update").then(res => {
                    if (!res.IsSuccess) Common.Alert(res.Message)
                })
            });
        }
    }

    ns.actions.BatchRejectAction = class BatchRejectAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = "批量驳回"
            this.Width = 80
        }

        Invoke(e, c) {
            const dataList = this.Page.GetDataGridCheckedValue();
            if (dataList.length === 0) {
                Common.Alert("请选择数据行！");
                return;
            }

            let dataList2 = [];

            const { LoginUser } = this.Page

            dataList.forEach(d => {
                let r = !LoginUser ? 1 : LoginUser.DataRight || 1;
                if (r === 3 && d.DataStatus === 1) dataList2.push(d);
            })

            if (dataList2.length === 0) {
                Common.Alert("对不起，选择的数据行未有符合可驳回的数据！");
                return;
            }

            c.DataList = dataList2;
            this.Reject(e, c);
        }

        Reject(e, c) {
            let editPage = new ns.pages.EditPage({
                Entity: this.GetRejectEntity(),
                Title: "驳回" + this.Page.Entity.Label,
                OkAction: { Invoke: (e1, c1) => { c1.DataList = c.DataList; this.OkAction(e1, c1, editPage) } }
            });
            editPage.Load()
        }

        OkAction(e, c, editPage) {
            const { Entity, KeyName, EditDialog } = editPage

            let editData = editPage.GetEditData()
            if (editData === false) return

            let dataList = [], idList = [], data = null;
            c.DataList.forEach(d => {
                data = { DataStatus: 2, RowVersion: d.RowVersion }
                data[Entity.PrimaryKey] = d[Entity.PrimaryKey];
                dataList.push(data)
                idList.push(d[Entity.PrimaryKey])
            })

            this.CreateRejectReason(editData.RejectReason, idList);

            this.EditEntityData(c, dataList, true, editPage)
        }

        GetRejectEntity() {
            const { Entity, KeyName } = this.Page

            return {
                Id: Entity.Id,
                Name: Entity.Name,
                Label: Entity.Label,
                PrimaryKey: Entity.PrimaryKey,
                IsSelectKey: true,
                Properties: [{
                    Name: "RejectReason",
                    Label: "驳回原因",
                    ControlType: "TextArea",
                    MaxLength: 500,
                    IsNullable: false,
                    EditOptions: {
                        X: 1,
                        Y: 1,
                        ControlWidth: 450,
                        Height: 80
                    }
                },
                {
                    Name: "DataStatus",
                    EditOptions: {
                        IsVisible: false
                    }
                }]
            }
        }

        CreateRejectReason(rejectReason, idList) {
            let data = {}
            let dataList = [];

            idList.forEach((id) => {
                data = {}
                data.DataId = Common.CreateGuid();
                data.RejectDataId = id;
                if (this.Page.LoginUser) data.UserName = this.Page.LoginUser.UserName + "(" + this.Page.LoginUser.LoginName + ")"
                data.RejectReason = rejectReason

                dataList.push(data)
            })

            const request = { Data: dataList }

            this.DispatchAction(() => this.Api.Create("RejectRecord", request))();
        }
    }

    ns.actions.BatchDeleteAction = class BatchDeleteAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = "批量删除"
            this.Width = 80
        }

        Invoke(e, c) {
            const dataList = this.Page.GetDataGridCheckedValue();
            if (dataList.length === 0) {
                Common.Alert("请选择数据行！");
                return;
            }

            let dataList2 = [], dataList3 = [];

            const { IsDataRight, LoginUser } = this.Page
            if (IsDataRight) {
                dataList.forEach(d => {
                    if (LoginUser && d.CreateUser === LoginUser.UserId) dataList2.push(d);
                })
            }
            else dataList2 = dataList;

            if (this.Page.IsDataStatus) {
                dataList2.forEach(d => {
                    if (d.DataStatus !== 1) dataList3.push(d);
                })
            }
            else dataList3 = dataList2;

            if (dataList3.length === 0) {
                Common.Alert("对不起，选择的数据行未有符合可删除的数据！");
                return;
            }

            Common.Confirm("确认删除吗？").then(() => {
                const { Entity, KeyName } = this.Page

                let dataList4 = [];
                let data = {}

                dataList3.forEach(d => {
                    data = {}
                    data[Entity.PrimaryKey] = d[Entity.PrimaryKey]
                    data.RowVersion = d.RowVersion
                    dataList4.push(data);
                })

                const request = { Data: dataList4 }

                this.DispatchAction(() => this.Api.Delete(Entity.Name, request))(Dispatch, KeyName + "_Delete", res => res.RowCount = dataList4.length).then(res => {
                    if (!res.IsSuccess) Common.Alert(res.Message)
                    else ns.data.Cache.UpdateEntityCacheList(Entity.Name);
                })
            })
        }
    }

    ns.actions.DeleteAction = class DeleteAction extends Index {
        constructor(dataGrid) {
            super(dataGrid)

            this.DataGrid = dataGrid
            this.Label = "删除"
        }

        GetText(rowData) {
            if (this.DataGrid.IsDataStatus && rowData.DataStatus === 1) return "";
            return this.GetEditText(rowData);
        }

        Invoke(e, c) {
            if (this.DataGrid.IsLocalData) {
                this.DataGrid.DeleteData(c.RowData[this.DataGrid.Entity.PrimaryKey])
                return
            }

            Common.Confirm("确认删除吗？").then(() => {
                const { Entity, RowCount, KeyName } = this.DataGrid

                let data = {}
                data[Entity.PrimaryKey] = c.RowData[Entity.PrimaryKey]
                data.RowVersion = c.RowData.RowVersion

                const request = { Data: [data] }

                this.DispatchAction(() => this.Api.Delete(Entity.Name, request))(Dispatch, KeyName + "_Delete", res => res.RowCount = RowCount).then(res => {
                    if (!res.IsSuccess) Common.Alert(res.Message)
                    else ns.data.Cache.UpdateEntityCacheList(Entity.Name);
                })
            })
        }
    }

    ns.actions.PagingAction = class PagingAction extends Index {
        constructor(dataPaging) {
            super(dataPaging)

            this.DataPaging = dataPaging
            this.SearchAction = this.DataPaging.SearchAction
        }

        Invoke(e, c) {
            this.SearchAction.PageIndex = this.GetPageIndex()
            this.SearchAction.Search(e, c, true)
        }

        GetPageIndex() {
            let pageIndex = this.SearchAction.PageIndex
            switch (this.Type) {
                case "First": return 1
                case "Pre": return pageIndex - 1
                case "Next": return pageIndex + 1
                case "Last": return this.DataPaging.PageCount
                default: this.pageIndex
            }
        }
    }

    ns.actions.PagingFirstAction = class PagingFirstAction extends ns.actions.PagingAction {
        constructor(dataPaging) {
            super(dataPaging)

            this.Label = "<<"
            this.Title = "首页"
            this.Type = "First"
        }
    }

    ns.actions.PagingPreAction = class PagingPreAction extends ns.actions.PagingAction {
        constructor(dataPaging) {
            super(dataPaging)

            this.Label = "<"
            this.Title = "上页"
            this.Type = "Pre"
        }
    }

    ns.actions.PagingNextAction = class PagingNextAction extends ns.actions.PagingAction {
        constructor(dataPaging) {
            super(dataPaging)

            this.Label = ">"
            this.Title = "下页"
            this.Type = "Next"
        }
    }

    ns.actions.PagingLastAction = class PagingLastAction extends ns.actions.PagingAction {
        constructor(options) {
            super(options)

            this.Label = ">>"
            this.Title = "尾页"
            this.Type = "Last"
        }
    }

    ns.actions.PagingIndexQueryAction = class PagingIndexQueryAction extends Index {
        constructor(options) {
            super(options)

            this.Label = "确定"

            this.DataPaging = options
            this.SearchAction = this.DataPaging.SearchAction
        }

        Invoke(e, c) {
            let pageIndex = this.DataPaging.GetInputPageIndex()
            if (pageIndex === false) return

            this.SearchAction.PageIndex = pageIndex
            this.SearchAction.Search(e, c, true)
        }
    }

    ns.actions.ExcelExportAction = class ExcelExportAction extends Index {
        constructor(page) {
            super(page)

            this.Label = "Excel导出"
            this.Width = 80
            this.Page = page
            this.SearchAction = page.SearchActions[0]
        }

        Invoke(e, c) {
            if (this.SearchAction.PageRecord > 50000) {
                Common.Alert("对不起，您要导出的数据量超过5万条，请先进行相应的数据筛选！")
                return
            }

            Common.Confirm("确定将数据Excel导出吗？").then(() => this.ExcelExport(c))
        }

        ExcelExport(c) {
            c.SetDisabled(true)

            const { Entity, SelectNames } = this.Page

            const request = {
                IsExcel: true,
                Title: Entity.Label,
                SelectNames: SelectNames,
                Conditions: this.SearchAction.ConditionList,
                OrderBys: this.Page.GetOrderByList(),
                HeaderInfos: this.Page.GetHeaderInfoList()
            }

            this.DispatchAction(() => this.Api.Query(Entity.Name, request))().then(res => {
                c.SetDisabled(false)
                if (res.IsSuccess && res.Data.FileName) this.DownLoad(res.Data.FileName)
                else if (res.Message) Common.Alert(res.Message)
            })
        }

        DownLoad(fileName) {
            var url = "download.aspx?fn=" + fileName
            window.open(url, "_self")
        }
    }

    ns.actions.ExcelImportAction = class ExcelImportAction extends Index {
        constructor(page) {
            super(page)

            this.Label = "Excel导入"
            this.Width = 80
            this.Page = page
            this.SearchAction = page.SearchActions[0]
        }

        Invoke(e, c) {
            new ns.components.ExcelImport({
                Entity: this.Page.Entity,
                SearchAction: this.SearchAction,
                Api: this.Api
            }).Import()
        }
    }

    ns.actions.ChangePasswordAction = class ChangePasswordAction extends Index {
        constructor(page) {
            super(page)

            this.Label = "修改密码"
            this.Page = page

            this.Entity = this.GetUserEntity();
        }

        Invoke(e, c) {
            this.UserId = Common.GetStorage("LoginUserId");
            if (!this.UserId) Common.ToLogin();

            this.EditPage = new ns.pages.EditPage({
                Entity: this.Entity,
                Title: "修改登录密码"
            });

            this.EditPage.Load();
            this.EditPage.EditDialog.OkAction = {
                Invoke: (e1, c1) => {
                    let editData = this.EditPage.GetEditData()
                    if (editData === false) return

                    c1.SetDisabled(true)
                    this.GetUserInfo(editData, c1);
                }
            };
        }

        GetUserInfo(editData, c1) {
            editData.OldLoginPassword = Common.ComputeMd5(editData.OldLoginPassword);
            editData.UserId = this.UserId
            var conditions = [{ Name: "UserId", Logic: "=", Value: this.UserId }, { Name: "LoginPassword", Logic: "=", Value: editData.OldLoginPassword }];

            this.GetDataList("User", ["UserId"], conditions).then(res => {
                if (res.IsSuccess) {
                    if (res.Data.DataList.length === 1) {
                        this.UpdateUserPassword(editData, c1);
                    }
                    else {
                        Common.Alert("原密码不正确").then(() => c1.SetDisabled(false))
                    }
                }
                else {
                    Common.Alert(res.Message).then(() => c1.SetDisabled(false))
                }
            })
        }

        UpdateUserPassword(editData, c1) {
            delete editData.OldLoginPassword;
            delete editData.AgainLoginPassword;
            editData.LoginPassword = Common.ComputeMd5(editData.LoginPassword);

            const request = { Data: [editData] }
            this.DispatchAction(() => this.Api.Update("User", request))().then(res => {
                if (res.IsSuccess) {
                    Common.Alert("修改成功！").then(() => {
                        this.EditPage.ClearControlValue()
                        this.EditPage.EditDialog.Close()
                    })
                }
                else {
                    Common.Alert(res.Message).then(() => c1.SetDisabled(false))
                }
            })
        }

        GetUserEntity() {
            return {
                Id: "A2FACD99-F429-4833-9173-B5E0CB2BF3F6",
                Name: "User",
                Label: "用户",
                PrimaryKey: "UserId",
                Properties: [{
                    Name: "OldLoginPassword",
                    Label: "原密码",
                    IsNullable: false,
                    ControlType: "Password",
                    MaxLength: 50,
                    EditOptions: {
                        X: 1,
                        Y: 1
                    }
                },
                {
                    Name: "LoginPassword",
                    Label: "新密码",
                    IsNullable: false,
                    ControlType: "Password",
                    MaxLength: 50,
                    EditOptions: {
                        X: 2,
                        Y: 1
                    }
                },
                {
                    Name: "AgainLoginPassword",
                    Label: "确认新密码",
                    ControlType: "Password",
                    MaxLength: 50,
                    EditOptions: {
                        X: 3,
                        Y: 1
                    }
                }],
                ExpandSetEditData: function (data, blUpdate, ns) {
                    const { Common } = ns.utils
                    let message = "", blSucceed = true
                    if (blSucceed && !Common.IsNullOrEmpty(data.LoginPassword) && data.LoginPassword !== data.AgainLoginPassword) {
                        message = "新密码与确认新密码不一致！"
                        blSucceed = false
                    }
                    if (blSucceed && data.LoginPassword === data.OldLoginPassword) {
                        message = "新密码与原密码一致！"
                        blSucceed = false
                    }
                    if (!blSucceed) {
                        Common.Alert(message)
                        return false
                    }
                    return data
                }
            }
        }
    }

    ns.actions.LookRejectRecordAction = class LookRejectRecordAction extends Index {
        constructor(dataGrid) {
            super(dataGrid)

            this.DataGrid = dataGrid
            this.Label = "驳回记录"
        }

        Invoke(e, c) {
            new ns.pages.DialogListPage({
                Width: 880,
                Height: 420,
                GridWidth: 880,
                GridHeight: 380,
                IsPage: false,
                Entity: this.GetRejectRecordEntity(c.RowData)
            }).Load()
        }

        GetRejectRecordEntity(rowData) {
            const id = rowData[this.DataGrid.Entity.PrimaryKey];
            return {
                Name: "RejectRecord",
                Label: "驳回记录",
                PrimaryKey: "DataId",
                Properties: [{
                    Name: "RejectDataId",
                    DefaultValue: id,
                    SearchOptions: {
                        IsVisible: false
                    }
                },
                {
                    Name: "RejectReason",
                    Label: "驳回原因",
                    DataOptions: {
                        X: 1,
                        ColumnWidth: 620
                    }
                },
                {
                    Name: "UserName",
                    Label: "操作人",
                    DataOptions: {
                        X: 2,
                        ColumnWidth: 120
                    }
                },
                {
                    Name: "CreateDate",
                    Label: "操作时间",
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 130
                    }
                }]
            }
        }
    }

    ns.actions.LookOperationLogAction = class LookOperationLogAction extends Index {
        constructor(dataGrid) {
            super(dataGrid)

            this.DataGrid = dataGrid
            this.Label = "查看日志"
        }

        GetText(rowData) {
            const { IsDataRight, LoginUser } = this.DataGrid
            if (IsDataRight) {
                if (!LoginUser) return "";
                let r = LoginUser.DataRight || 1;
                if (r === 3) return "查看日志";
                else return "";
            }
            return "查看日志";
        }

        Invoke(e, c) {
            new ns.pages.DialogListPage({
                Width: 880,
                Height: 420,
                GridWidth: 880,
                GridHeight: 380,
                Entity: this.GetOperationLogEntity(c.RowData)
            }).Load();
        }

        GetOperationLogEntity(rowData, entityName) {
            const id = rowData ? rowData[this.DataGrid.Entity.PrimaryKey] : "";
            return {
                Name: "ViewDataOperationLog",
                Label: "操作日志",
                PrimaryKey: "LogId",
                Properties: [{
                    Name: "PrimaryKey",
                    DefaultValue: id,
                    SearchOptions: {
                        IsVisible: false
                    }
                },
                {
                    Name: "EntityName",
                    DefaultValue: entityName || "",
                    SearchOptions: {
                        IsVisible: false
                    }
                },
                {
                    Name: "TableLogId",
                    IsVisible: false,
                    IsData: true
                },
                {
                    Name: "OperationName",
                    Label: "操作名称",
                    DataOptions: {
                        X: 1,
                        ColumnWidth: 130
                    }
                },
                {
                    Name: "UserName",
                    Label: "操作人",
                    DataOptions: {
                        X: 2,
                        ColumnWidth: 130
                    }
                },
                {
                    Name: "CreateDate",
                    Label: "操作时间",
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 130
                    }
                },
                {
                    Name: "LookDetail",
                    Label: "详细",
                    DataOptions: {
                        X: 4,
                        ColumnWidth: 130,
                        ActionInvoke: (e, c) => {
                            this.LookDetailLog(c.RowData)
                        },
                        ControlType: "LinkButton",
                        TextAlign: "center",
                    }
                }]
            }
        }

        LookDetailLog(rowData) {
            new ns.pages.DialogListPage({
                Width: 880,
                Height: 420,
                GridWidth: 880,
                GridHeight: 380,
                IsPage: false,
                Title: "属性变更明细",
                Entity: this.GetOperationFieldLogEntity(rowData)
            }).Load();
        }

        GetOperationFieldLogEntity(rowData) {
            const id = rowData.TableLogId;
            return {
                Name: "DataOperationFieldLog",
                Label: "操作日志",
                PrimaryKey: "FieldLogId",
                OrderByList: [],
                Properties: [{
                    Name: "TableLogId",
                    DefaultValue: id,
                    SearchOptions: {
                        IsVisible: false
                    }
                },
                {
                    Name: "FieldName",
                    Label: "属性名",
                    DataOptions: {
                        X: 1,
                        ColumnWidth: 150
                    }
                },
                {
                    Name: "OldValue",
                    Label: "旧值",
                    DataOptions: {
                        X: 2,
                        ColumnWidth: 350
                    }
                },
                {
                    Name: "NewValue",
                    Label: "新值",
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 350
                    }
                }]
            }
        }
    }

    ns.actions.LookOperationLogAction2 = class LookOperationLogAction2 extends ns.actions.LookOperationLogAction {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = "操作日志"
            this.Width = 80
        }

        Invoke(e, c) {
            new ns.pages.DialogListPage({
                Width: 880,
                Height: 420,
                GridWidth: 880,
                GridHeight: 380,
                Entity: this.GetOperationLogEntity(null, this.Page.Entity.Name)
            }).Load();
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.actions

    ns.actions.DialogOkAction = class DialogOkAction extends Index {
        constructor(dialog) {
            super(dialog)

            this.Dialog = dialog
            this.Label = this.Label || "确定"
        }

        Invoke(e, c) {
            this.Dialog.OkAction && this.Dialog.OkAction.Invoke(e, c)
        }
    }

    ns.actions.DialogSaveAction = class DialogSaveAction extends Index {
        constructor(dialog) {
            super(dialog)

            this.Dialog = dialog
            this.Label = this.Label || "保存"
        }

        Invoke(e, c) {
            c.Type = 1;
            this.Dialog.OkAction && this.Dialog.OkAction.Invoke(e, c)
        }
    }

    ns.actions.DialogSubmitAction = class DialogSubmitAction extends Index {
        constructor(dialog) {
            super(dialog)

            this.Dialog = dialog
            this.Label = this.Label || "保存并提交"
            this.Width = 100
        }

        Invoke(e, c) {
            c.Type = 2;
            this.Dialog.OkAction && this.Dialog.OkAction.Invoke(e, c)
        }
    }

    ns.actions.DialogCancelAction = class DialogCancelAction extends Index {
        constructor(dialog) {
            super(dialog)

            this.Dialog = dialog
            this.Label = this.Label || "取消"
        }

        Invoke(e, c) {
            this.Dialog.Close()
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.actions
    const { Common } = ns.utils

    ns.actions.CreateAction = class CreateAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
        }

        Invoke(e, c) {
            this.Edit(c)
        }
    }

    ns.actions.UpdateAction = class UpdateAction extends Index {
        constructor(options) {
            super(options)
        }

        Invoke(e, c) {
            this.Edit(c, true)
        }
    }

    ns.actions.GridViewAddAction = class GridViewAddAction extends Index {
        constructor(gridView) {
            super(gridView)

            this.Label = "添加"
            this.GridView = gridView
        }

        Invoke(e, c) {
            new ns.pages.EditPage({ Entity: this.GridView.Entity, IsLocalData: true, SaveData: (d) => this.GridView.SaveData(d) }).Load()
        }
    }

})($ns);
((ns) => {
    const { Common, HtmlTag } = ns.utils

    ns.controls.Index = class Index {
        constructor(options) {
            this.Id = Common.CreateGuid()
            this.Attributes = []

            options && Object.assign(this, options)

            this.Height = this.Height || 30
        }

        GetHtml() { return "" }
        EventLoad2() { }
        DataLoad2() { }

        EventLoad() {
            this.Element = HtmlTag.GetById(this.Id)
            this.EventLoad2()
        }

        GetRowClassName() { return "" }

        DataLoad() {
            this.DataLoad2();
        }

        GetAttributeHtml() {
            return this.Attributes.map((a) => this.GetAttributeItem(a)).join("")
        }

        GetAttributeItem(a) {
            return ` ${a.Name}="${a.Value}"`
        }

        SetAttribute(name, value) {
            this.Attributes.push({ Name: name, Value: value })
        }

        GetInputHtml(type) {
            let html = []

            html.push(`<input id="${this.Id}" type="${type}"`)

            html.push(this.GetAttributeHtml())

            html.push("/>")

            return html.join("")
        }

        GetValue() {
            if (this.ControlType === "CheckBox") {
                return this.GetCheckBoxValue()
            }
            let value = HtmlTag.GetValue(this.Element)
            this.Value = Common.IsNullOrEmpty(value) ? "" : Common.Trim(value)
            return this.Value;
        }

        SetValue(value) {
            if (this.ControlType === "CheckBox") {
                this.SetCheckBoxValue(value)
                return
            }
            value = value === undefined ? "" : value
            this.Value = value;
            HtmlTag.SetValue(this.Element, value)
        }

        SetDisabled(disabled) {
            HtmlTag.SetDisabled(this.Element, disabled)
        }

        GetDisabled() {
            return HtmlTag.GetDisabled(this.Element)
        }

        GetStyle(styleList) {
            return styleList.length === 0 ? "" : " style=\"" + styleList.join("") + "\""
        }

        GetClass() {
            return this.ClassName ? " class=" + this.ClassName : ""
        }

        GetDataList() {
            return ns.data.Cache.GetPropertyDataList(this)
        }

        GetMaxLength() {
            switch (this.DataType) {
                case "int": return 10
                case "float":
                case "money":
                case "long": return 20
                default: return 0
            }
        }

        GetScale() {
            switch (this.DataType) {
                case "int":
                case "long": 0
                case "float":
                case "money": return 2
                default: return 0
            }
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.SpanLabel = class SpanLabel extends Index {
        constructor(options) {
            super(options)

            if (this.LabelWidth) this.Width = this.LabelWidth
            this.Width = this.Width || 100

            Common.InitValue(this, ["IsColon", "IsWidth"], true)
        }

        GetHtml() {
            if (!this.Label || this.ControlType === "CheckBox" || this.ControlType === "GridView" || this.ControlType === "Button") {
                this.Width = 0
                return ""
            }

            const colon = this.IsColon ? "：" : ""

            let styleList = []
            if (this.IsWidth) styleList.push(`width:${this.Width}px;`)
            let style = this.GetStyle(styleList)

            let className = this.GetClass()

            let label = Common.ReplaceHtmlTag(this.Label);
            return `<span id="${this.Id}"${style}${className}>${label}${colon}</span>`
        }

        SetValue(value) {
            HtmlTag.SetHtml(this.Element, value)
        }
    }

    ns.controls.SpanText = class SpanText extends Index {
        constructor(options) {
            super(options)
        }

        GetHtml() {
            let styleList = []
            if (this.IsWidth) styleList.push(`width:${this.Width}px;`)
            let style = this.GetStyle(styleList)

            let className = this.GetClass()

            let v = this.Value || this.DefaultValue;
            v = Common.ReplaceHtmlTag(v);
            return `<span id="${this.Id}"${style}${className}>${v}</span>`
        }

        SetValue(value) {
            HtmlTag.SetHtml(this.Element, value)
        }
    }

    ns.controls.DataSpan = class DataSpan extends Index {
        constructor(options) {
            super(options)
        }

        GetHtml() {
            this.Value = Common.IsNullOrEmpty(this.Value) ? "" : this.Value
            const { DataType } = this;
            this.IsNumberType = DataType === "int" || DataType === "long" || DataType === "float" || DataType === "money";
            this.SetFormatStyle();

            if (!this.IsLabel) this.SetValue()
            let colorStyle = this.GetColorStyle()
            this.SetCurrencyValue();

            let v = Common.ReplaceHtmlTag(this.Value);
            return `<span id="${this.Id}" style="padding:1px 2px 1px 2px;${colorStyle}">${v}</span>`
        }

        SetFormatStyle() {
            switch (this.DataFormat) {
                case "日期": {
                    if (this.Value) this.Value = this.Value.substring(0, 10);
                    break;
                }
                case "货币": {
                    this.IsCurrency = true; break;
                }
            }

            if (!this.TextAlign) {
                if (this.IsNumberType || this.DataType === "date") this.TextAlign = "right";
            }
        }

        SetCurrencyValue() {
            if (!this.IsCurrency && this.DataType === "money") this.IsCurrency = true;
            if (this.IsCurrency) this.Value = Common.ToCurrency(this.Value)
            else if (this.IsNumberType && this.Scale > 0) this.Value = Common.GetNumberValue(this.Value).toFixed(this.Scale);
        }

        GetColorStyle() {
            if (this.Value && this.IsNumberType) {
                var nv = Common.GetNumberValue(this.Value);
                if (nv < 0) return " color:red;"
            }

            return ""
        }

        SetValue() {
            if (this.Options && this.Options.length > 0) {
                this.SetValueText(this.Options, "Value", "Text");
            }
            else if (this.DataList && this.DataList.length > 0) {
                this.SetValueText(this.DataList, this.ValueName, this.TextName);
            }

            if (this.ControlType === "CheckBox") {
                this.CheckedText = this.CheckedText === undefined ? "是" : this.CheckedText
                this.UnCheckedText = this.UnCheckedText === undefined ? "否" : this.UnCheckedText
                let checkedValue = this.CheckedValue === undefined ? "true" : this.CheckedValue
                this.Value = Common.IsEquals(this.Value, checkedValue, true) ? this.CheckedText : this.UnCheckedText
            }
        }

        SetValueText(dataList, valueName, textName, blSet) {
            let list = dataList.filter(f => f[valueName] !== undefined && Common.IsEquals(f[valueName], this.Value))
            if (list.length > 0) {
                this.Value = list[0][textName]
                blSet && HtmlTag.SetHtml(this.Element, Common.ReplaceHtmlTag(this.Value));
            }
        }

        DataLoad2() {
            if (!this.DataList && this.DataSource) {
                this.GetDataList().then(() => this.SetValueText(this.DataList, this.ValueName, this.TextName, true))
            }
        }
    }

    ns.controls.DataCheckBox = class DataCheckBox extends Index {
        constructor(options) {
            super(options)

            this.ColumnWidth = 20;
            this.TextAlign = "center";
        }

        GetHtml() {
            return this.GetInputHtml("checkbox")
        }

        GetChecked() { return this.Element.checked }

        SetChecked(checked) {
            if (checked === undefined) {
                window.setTimeout(() => {
                    if (!this.IsChangeEvent) {
                        if (this.Element.checked) this.Element.checked = false;
                        else this.Element.checked = true;
                        this.CheckChanged && this.CheckChanged(this.Element.checked)
                    }
                    else {
                        this.IsChangeEvent = false
                    }
                }, 50)
            }
            else this.Element.checked = checked
        }

        EventLoad2() {
            HtmlTag.BindEvent(this.Element, "change", (e) => this.Changed(e))
        }

        Changed(e) {
            this.IsChangeEvent = true
            this.CheckChanged && this.CheckChanged(this.Element.checked)
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.TextBox = class TextBox extends Index {
        constructor(options) {
            super(options)

            if (this.ControlWidth) this.Width = this.ControlWidth
            this.Width = this.Width || 200
        }

        GetHtml() {
            this.SetDataType();
            this.SetAttribute("name", this.Name)
            this.MaxLength > 0 && this.SetAttribute("maxlength", this.MaxLength)
            this.IsInput() && this.SetAttribute("autocomplete", "off")
            this.ClassName && this.SetAttribute("class", this.ClassName)
            this.PlaceHolder && this.SetAttribute("placeholder", this.PlaceHolder)
            this.Checked && this.SetAttribute("checked", "checked")
            this.DefaultValue && this.SetAttribute("value", this.DefaultValue)

            let styleList = []
            this.IsInput() && styleList.push(`width:${this.Width}px;`)
            styleList.length > 0 && this.SetAttribute("style", styleList.join(""))

            switch (this.ControlType) {
                case "Password": return this.GetInputHtml("password")
                case "CheckBox": return this.GetCheckBoxHtml(this.GetInputHtml("checkbox"))
                case "TextDate": return this.GetInputHtml("date")
                default: return this.GetInputHtml("text")
            }
        }

        GetCheckBoxHtml(html) {
            let label = this.Label.replace("是否", "")
            return "<div class=\"DivCheckBox\" style=\"margin-left:" + (this.LabelWidth + 5) + "px;\"><label>" + html + "<span>" + label + "</span></label></div>"
        }

        GetCheckBoxValue() {
            let checkedValue = this.CheckedValue !== undefined ? this.CheckedValue : "true"
            let unCheckedValue = this.UnCheckedValue !== undefined ? this.UnCheckedValue : "false"
            return this.Element.checked ? checkedValue : unCheckedValue
        }

        SetCheckBoxValue(value) {
            let v = Common.IsNullOrEmpty(value) ? "" : value.toString().toLowerCase()
            let checkedValue = this.CheckedValue !== undefined ? this.CheckedValue : "true"
            this.Element.checked = v === checkedValue.toString().toLowerCase()
        }

        IsInput() {
            return this.ControlType !== "CheckBox" && this.ControlType !== "Radio"
        }

        EventLoad3() { }
        DataLoad3() { }

        EventLoad2() {
            this.IsKeyPress = false;
            this.IsBlur = false;
            if (this.EnterControl) this.IsKeyPress = true;
            else if (this.ControlType === "TextBox" && this.IsNumberType) {
                this.IsBlur = true;
                this.IsKeyPress = true;
            }

            if (this.IsKeyPress) HtmlTag.BindEvent(this.Element, "keypress", (e) => this.KeypressEvent(e))
            if (this.IsBlur) HtmlTag.BindEvent(this.Element, "blur", (e) => this.BlurEvent(e))

            this.EventLoad3()
        }

        SetDataType() {
            const { DataType } = this;
            this.IsNumberType = DataType === "int" || DataType === "long" || DataType === "float" || DataType === "money";
            if (!this.MaxLength) {
                var maxLength = this.GetMaxLength();
                if (maxLength > 0) this.MaxLength = maxLength;
            }
            if (!this.Scale) this.Scale = this.GetScale()
        }

        DataLoad2() {
            this.DataLoad3()
        }

        KeypressEvent(e) {
            var key = window.event ? e.keyCode : e.which;
            var dataType = this.DataType === "int" || this.DataType === "long" ? "int" : "decimal";
            var blSucceed = true;

            if (key != 13 && key != 8 && key > 0) {
                if (dataType == "int") {
                    blSucceed = Common.IsNumberCharCode(e);
                }
                else if (dataType == "decimal") {
                    blSucceed = Common.IsDecimalCharCode(e);
                }
            }

            if (blSucceed && key == 13) {
                this.EnterControl && this.KeypressEnter(e);
            }

            return blSucceed;
        }

        BlurEvent(e) {
            var value = HtmlTag.GetValue(this.Element);

            var message = ""
            if (this.DataType === "date") message = ValidateDate(value)
            else if (this.IsNumberType) message = this.ValidateNumber(value);

            if (message) {
                Common.Alert(message);
                this.Element.focus();
                HtmlTag.SetValue(this.Element, "");
            }

            return !message;
        }

        ValidateDate(value) {
            if (Common.IsNullOrEmpty(value)) return "";

            var message = "";

            var blSucceed = true;
            if (value.length > 10) {
                blSucceed = false;
            }
            if (blSucceed) {
                var date = Common.ConvertToDate(value, "yyyy-MM-dd");
                if (isNaN(date)) date = Common.ConvertToDate(value, "yyyy/MM/dd");

                if (isNaN(date)) {
                    blSucceed = false;
                }
            }
            if (!blSucceed) message = "对不起，您输入的日期格式不正确！\n支持日期格式如下：2012-12-12";

            return message;
        }

        ValidateNumber(value) {
            var message = "";
            var dataType = this.DataType === "int" || this.DataType === "long" ? "int" : "decimal";
            var scale = this.Scale === undefined ? 0 : parseInt(this.Scale);

            if (!Common.IsNullOrEmpty(value)) {
                if (dataType == "int") {
                    message = this.JudgeNumber(value);
                }
                else if (dataType == "decimal") {
                    if (scale == 0) {
                        message = this.JudgeNumber(value);
                    }
                    else if (scale == 1) {
                        message = this.JudgeDecimal1(value);
                    }
                    else if (scale == 2) {
                        message = this.JudgeDecimal2(value);
                    }
                    else if (scale == 3) {
                        message = this.JudgeDecimal3(value);
                    }
                    else if (scale == 4) {
                        message = this.JudgeDecimal4(value);
                    }
                    else {
                        message = this.JudgeDecimal(value);
                    }
                }
            }

            return message;
        }

        KeypressEnter(e) {
            if (!this.EnterControl.Element) return
            this.EnterControl.Element.focus();
            this.EnterControl.Element.click();
        }

        JudgeDecimal(value) {
            return Common.IsDecimal(value) ? "" : "请输入一个数值！";
        }

        JudgeDecimal1(value) {
            return Common.IsDecimal1(value) ? "" : "请输入一个数值，最多只能有一位小数！";
        }

        JudgeDecimal2(value) {
            return Common.IsDecimal2(value) ? "" : "请输入一个数值，最多只能有两位小数！";
        }

        JudgeDecimal3(value) {
            return Common.IsDecimal3(value) ? "" : "请输入一个数值，最多只能有三位小数！";
        }

        JudgeDecimal4(value) {
            return Common.IsDecimal4(value) ? "" : "请输入一个数值，最多只能有四位小数！";
        }

        JudgeNumber(value) {
            return Common.IsNumber(value) ? "" : "请输入一个整数！";
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.Button = class Button extends Index {
        constructor(options) {
            super(options)

            this.Width = this.Width || 60
            this.Label = this.Label || this.Name
        }

        GetHtml() {
            this.SetAttribute("value", this.Action.Label || this.Label)
            this.Action.Title && this.SetAttribute("title", this.Action.Title)
            this.ClassName && this.SetAttribute("class", this.ClassName)

            let styleList = []
            styleList.push(`width:${this.Width}px;`)
            this.SetAttribute("style", styleList.join(""))

            return this.GetInputHtml("button")
        }

        EventLoad2() {
            this.Action.EventNames.forEach((name) => { HtmlTag.BindEvent(this.Element, name, (e) => this.Action.Invoke(e, this)) })
            if (this.Action.IsOkFocus) this.Element.focus()
        }

        SetValue() { }

        GetValue() { }
    }

    ns.controls.LinkButton = class LinkButton extends Index {
        constructor(options) {
            super(options)

            this.Label = this.Label || this.Action.Label
        }

        GetHtml() {
            let v = this.Label
            if (this.Action.GetText) v = this.Action.GetText(this.RowData);
            if (Common.IsNullOrEmpty(v)) return "";
            return `<a href="javascript:void(0);" id=${this.Id}>${v}</a>`
        }

        EventLoad2() {
            this.Action.EventNames.forEach((name) => { HtmlTag.BindEvent(this.Element, name, (e) => this.Action.Invoke(e, this)) })
        }
    }

    ns.controls.LinkButtonList = class LinkButtonList extends Index {
        constructor(options) {
            super(options)
        }

        GetHtml() {
            this.LinkButtons = this.Actions.map(a => new ns.controls.LinkButton({ RowData: this.RowData, Action: a }))

            let html = ["<div class=\"ASpanList\">"];
            html = html.concat(this.LinkButtons.map(m => "<span>" + m.GetHtml() + "</span>"));
            html.push("</div>")

            return html.join("");
        }

        EventLoad2() {
            this.LinkButtons.forEach(a => a.EventLoad());
        }

        DataLoad2() {
            this.LinkButtons.forEach(a => a.DataLoad());
        }
    }

})($ns);
((ns) => {
    const { Index, Button } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.GridView = class GridView extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivGridAdd: "DivGridAdd" }
            this.Entity.Label = this.Entity.Label || this.Entity.Name
            if (this.ControlWidth) this.Width = this.ControlWidth
            this.Init()
        }

        Init() {
            this.Entity.ExpandPageInit && this.Entity.ExpandPageInit.call(this, ns)
            this.Entity.Properties.forEach((p) => this.InitProperty(p))

            this.DataProperties = this.Entity.Properties.filter((p) => p.IsData).map((p) => Object.assign({}, p, p.DataOptions))
            this.GridViewLayout = new ns.layouts.GridView(this.GetGridViewComponents())

            this.AddButton = new Button({ Action: new ns.actions.GridViewAddAction(this) })

            this.Height += 30
        }

        GetRowClassName() { return "DivRowGridView" }

        InitProperty(p) {
            Common.InitValue(p, ["IsData"], p.DataOptions !== undefined)
            Common.InitValue(p, ["IsEdit"], p.EditOptions !== undefined)
        }

        GetHtml() {
            let html = []

            let id = "record_" + this.Id;
            let recordHtml = `<span id="${id}">共 0 条记录</span>`;
            let addHtml = this.AddButton.GetHtml()
            html.push(`<div class="${this.Styles.DivGridAdd}">`);
            html.push(`<div class="DivAddLeft">${recordHtml}</div>`)
            html.push(`<div class="DivAddRight">${addHtml}</div>`)
            html.push("</div>")
            html.push(this.GridViewLayout.GetHtml())

            return html.join("")
        }

        SaveData(d) { this.DataGridComponent.SaveData(d) }

        GetGridViewComponents() {
            this.DataGridComponent = new ns.components.DataGrid({
                Entity: this.Entity, IsLocalData: true,
                IsDelete: true,
                IsEdit: true,
                Width: this.Width || 0,
                Height: this.Height, Properties: this.DataProperties, IsFixedWidth: true
            })
            return { DataGridComponent: this.DataGridComponent }
        }

        GetValue() {
            return this.DataGridComponent.GetValue()
        }

        SetValue(value) {
            this.DataGridComponent.SetValue(value)
        }

        EventLoad2() {
            this.DataGridComponent.SpanRecord = HtmlTag.GetById("record_" + this.Id);
            this.DataGridComponent.EventLoad()
            this.AddButton.EventLoad()
        }

        DataLoad2() {
            this.DataGridComponent.DataLoad()
            this.AddButton.DataLoad()
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.DownList = class DownList extends Index {
        constructor(options) {
            super(options)

            if (this.ControlWidth) this.Width = this.ControlWidth
            this.Width = this.Width || 200
            Common.InitValue(this, ["IsEmpty"], true)

            this.ClassName = this.ClassName || "DownList"
        }

        GetHtml() {
            this.SetAttribute("name", this.Name)
            this.ClassName && this.SetAttribute("class", this.ClassName)

            let styleList = []
            styleList.push(`width:${this.Width + 3}px;`)
            if (this.StyleString) styleList.push(this.StyleString)
            styleList.length > 0 && this.SetAttribute("style", styleList.join(""))

            let html = []

            html.push(`<select id="${this.Id}"`)

            html.push(this.GetAttributeHtml())

            html.push(">")
            html.push(this.GetOptionsHtml())
            html.push("<select>")

            return html.join("")
        }

        GetOptionsHtml() {
            let html = []
            this.IsEmpty && html.push("<option value=\"\"></option>")
            if (this.Options && this.Options.length > 0) {
                let v, t
                this.Options.forEach(p => {
                    if (p.Value != undefined && p.Text != undefined) {
                        v = p.Value
                        t = p.Text
                    }
                    else {
                        v = p
                        t = p
                    }
                    html.push(`<option value="${v}">${t}</option>`)
                })
            }
            else {
                !this.IsEmpty && html.push("<option value=\"\"></option>")
            }

            return html.join("")
        }

        LoadOptionHtml() {
            let html = []
            const { TextName, ValueName } = this.DataSource;
            this.IsEmpty && html.push("<option value=\"\"></option>")
            if (this.DataList && this.DataList.length > 0) {
                let v, t, s
                this.DataList.forEach(d => {
                    v = d[ValueName], t = d[TextName];
                    s = Common.IsEquals(v, this.Value) ? " selected=\"selected\"" : "";
                    html.push(`<option value="${v}"${s}>${t}</option>`)
                })
            }
            else {
                !this.IsEmpty && html.push("<option></option>")
            }

            HtmlTag.SetHtml(this.Element, html.join(""));
        }

        EventLoad2() {
            this.Action && this.Action.EventNames.forEach((name) => { HtmlTag.BindEvent(this.Element, name, (e) => this.Action.Invoke(e, this)) })
        }

        DataLoad2() {
            this.DataSource && this.GetDataList();
            if (this.DataSource) {
                HtmlTag.SetHtml(this.Element, "<option value=\"\">数据源加载中……</option>");
                this.GetDataList().then(() => this.LoadOptionHtml())
            }
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.TextArea = class TextArea extends Index {
        constructor(options) {
            super(options)

            if (this.ControlWidth) this.Width = this.ControlWidth
            this.Width = this.Width || 200

            this.ClassName = this.ClassName || "TextArea"
        }

        GetHtml() {
            this.SetAttribute("name", this.Name)
            this.ClassName && this.SetAttribute("class", this.ClassName)

            let styleList = []
            styleList.push(`width:${this.Width}px;`)
            let height = this.Height - 8
            styleList.push(`height:${height}px;`)
            styleList.length > 0 && this.SetAttribute("style", styleList.join(""))

            let html = []

            html.push(`<textarea  cols="100" rows="100"" id="${this.Id}"`)

            html.push(this.GetAttributeHtml())

            html.push(">")
            html.push("</textarea>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { TextBox } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.TextSelect = class TextSelect extends TextBox {
        constructor(options) {
            super(options)

            this.DataList = this.DataList || [];
            this.SelectDataList = [];
            this.ValueName = this.ValueName || "Value";
            this.TextName = this.TextName || "Text";
            this.SelectValue = "";
            this.SelectText = "";
            this.MaxItemLength = 100;
        }

        EventLoad3() {
            HtmlTag.BindEvent(this.Element, "click", (e) => { this.LoadSelect(e) });
            HtmlTag.BindEvent(this.Element, "change", (e) => { this.InputChange(e) });
            HtmlTag.BindEvent(this.Element, "keydown", (e) => { this.SearchByKeyword(e) });
            HtmlTag.BindEvent(this.Element, "keypress", (e) => { this.SearchByKeyword(e) });
        }

        SearchByKeyword(e) {
            if (this.TimeoutId) window.clearInterval(this.TimeoutId);
            this.TimeoutId = window.setTimeout(() => this.BandKeywordData(), 150);
        }

        BandKeywordData() {
            if (!this.IsEnable) { this.LoadSelect() }
            if (!this.IsEnable) return;
            this.SelectDataList = this.SearchData();
            this.SetSelectOffSet();
            const { Width, Height } = this.SelectOffSet;

            HtmlTag.SetStyle(this.SelectTag, { width: Width + "px", height: Height + "px" });
            HtmlTag.SetHtml(this.ContentTag, this.GetItemHtml(this.SelectDataList));

            this.BindSelectEvents();
        }

        InputChange(e) {
            var value = Common.Trim(e.target.value);
            if (!Common.IsEquals(value, this.SelectText)) {
                this.SelectValue = "";
                this.SelectText = "";
                e.target.value = "";
            }
        }

        LoadSelect() {
            if (this.DataList.length == 0 || this.IsEnable) {
                return;
            }

            let offSet = HtmlTag.GetOffSet(this.Element);
            this.SelectOffSet = {
                Top: offSet.top + offSet.height + 1,
                Left: offSet.left + 1
            }

            HtmlTag.AppendHtml(document.body, this.GetSelectHtml());
            this.IsEnable = true;

            this.SelectEventLoad();
        }

        SetSelectOffSet() {
            var width = this.GetDataMaxWidth(this.SelectDataList) + 20;
            width = width > this.Width + 2 ? width : this.Width + 2;

            let height = this.SelectDataList.length * 30;
            height = height > 300 ? 300 : height;

            this.SelectOffSet.Width = width;
            this.SelectOffSet.Height = height;
        }

        GetSelectHtml() {
            this.SelectDataList = this.SearchData();
            this.SetSelectOffSet();

            const { Top, Left, Width, Height } = this.SelectOffSet;
            let zIndex = Common.GetZIndex();

            var html = [];

            html.push(`<div class="TextSelect" style="z-index:${zIndex};top:${Top}px;left:${Left}px;width:${Width}px;height:${Height}px;" id="divSelect_${this.Id}">`);
            html.push(`<div class="SelectArea" id="divContent_${this.Id}">`);
            html.push(this.GetItemHtml(this.SelectDataList));
            html.push("</div></div>");

            return html.join("");
        }

        GetItemHtml(dataList) {
            var html = [], value = "", text = "";;

            html.push("<ul>");
            dataList.forEach(item => {
                item.Id = Common.CreateGuid();
                value = item[this.ValueName];
                text = item[this.TextName];
                if (!Common.IsNullOrEmpty(value) && !Common.IsNullOrEmpty(text)) {
                    html.push(`<li><a class="DivRadiusBorder" id=${item.Id} href="javascript:void(0);">${text}</a></li>`);
                }
            });
            html.push("</ul>");

            return html.join("");
        }

        GetDataMaxWidth(dataList) {
            var width = 0, w = 0, t = null;
            dataList.forEach(d => {
                t = d[this.TextName]
                if (t) {
                    w = Common.ComputeStringWidth(t)
                    width = w > width ? w : width;
                }
            });
            return width;
        }

        SearchData() {
            let term = HtmlTag.GetValue(this.Element);

            let dataList = [], iCount = 0;
            if (!term) {
                iCount = this.DataList.length > this.MaxItemLength ? this.MaxItemLength : this.DataList.length;
                for (let i = 0; i < iCount; i++) {
                    dataList.push(this.DataList[i]);
                }
            }
            else {
                let value = "", text = "";
                this.DataList.forEach(d => {
                    value = d[this.ValueName]; text = d[this.TextName];
                    if (value && text && text.indexOf(term) >= 0) dataList.push(d);
                });
            }

            return dataList;
        }

        SelectEventLoad() {
            this.SelectTag = HtmlTag.GetById("divSelect_" + this.Id);
            this.ContentTag = HtmlTag.GetById("divContent_" + this.Id);

            HtmlTag.OffBindEvent(document.body, "click.TextSelect");
            HtmlTag.BindEvent(document.body, "click.TextSelect", (e) => {
                const { Top, Left, Width, Height } = this.SelectOffSet;
                var x = e.pageX, y = e.pageY;
                var blExists = true;
                if (x < Left || x > Left + Width) {
                    blExists = false;
                }
                else if (y < Top - 35 || y > Top + Height) {
                    blExists = false;
                }
                if (!blExists) {
                    this.Destory();
                }
            });

            this.BindSelectEvents();
        }

        BindSelectEvents() {
            this.SelectDataList.forEach(d => {
                HtmlTag.BindEvent(HtmlTag.GetById(d.Id), "click", (e) => {
                    this.SetSelectItem(e.target.id);
                });
            })
        }

        SetSelectItem(id) {
            let list = this.SelectDataList.filter(f => f.Id === id)
            if (list.length === 1) {
                this.SelectText = list[0][this.TextName];
                this.SelectValue = list[0][this.ValueName];
                HtmlTag.SetValue(this.Element, this.SelectText);
                this.Destory();
            }
        }

        GetValue() {
            return this.SelectValue || "";
        }

        SetValue(value) {
            this.SelectValue = value;
            let list = this.DataList.filter(f => Common.IsEquals(f[this.ValueName], value))
            if (list.length === 1) {
                this.SelectText = list[0][this.TextName];
                HtmlTag.SetValue(this.Element, this.SelectText);
            }
        }

        DataLoad3() {
            if (this.DataSource) {
                this.Element.placeholder = "数据源加载中……"
                this.GetDataList().then(() => {
                    this.Element.placeholder = "";
                    if (!this.SelectText && this.SelectValue) this.SetValue(this.SelectValue);
                })
            }
        }

        Destory() {
            this.IsEnable = false;
            HtmlTag.RemoveElement(document.body, this.SelectTag);
            HtmlTag.OffBindEvent(document.body, "click.TextSelect");
        }
    }

})($ns);
((ns) => {
    const { Common } = ns.utils
    const { GetStateValue } = ns.data.Index

    ns.components.Index = class Index {
        constructor(options) {
            this.Id = Common.CreateGuid()

            options && Object.assign(this, options)
        }

        GetHtml() { return "" }

        InitTagObject() { }

        EventLoad2() { }
        DataLoad2() { }

        EventLoad() {
            this.InitTagObject()
            this.ComponentList && this.ComponentList.forEach((c) => c.EventLoad())
            this.ControlList && this.ControlList.forEach((c) => c.EventLoad())
            this.EventLoad2()
        }

        DataLoad() {
            this.ComponentList && this.ComponentList.forEach((c) => c.DataLoad())
            this.ControlList && this.ControlList.forEach((c) => c.DataLoad())
            this.DataLoad2()
        }

        GetDataValue(state, name) {
            return GetStateValue(state, this.KeyName, name, this[name]).then((v) => {
                if (v != null) { this[name] = v }
                return Promise.resolve(v != null)
            })
        }

        IsFailMessage(res) {
            if (res.ActionFailedMessage) {
                Common.Alert(res.ActionFailedMessage)
                return true
            }
            return false
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.components
    const { Button } = ns.controls

    ns.components.Buttons = class Buttons extends Index {
        constructor(options) {
            super(options)

            this.Actions = this.Actions || []

            this.ControlList = this.Actions.map((a) => new Button({ Action: a, Width: a.Width }))

            this.Styles = this.Styles || { UlButton: "UlButton" }
        }

        GetHtml() {
            let html = []

            html.push(`<ul cass="UlButton">`)
            html = html.concat(this.ControlList.map((c) => "<li>" + c.GetHtml() + "</li>"))
            html.push("</ul>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.components
    const { SpanLabel, SpanText, TextBox, GridView, DownList, TextArea, TextSelect, Button } = ns.controls
    const { Common } = ns.utils

    ns.components.PropertyItem = class PropertyItem extends Index {
        constructor(options) {
            super(options)

            this.InitControls()

            this.IsPassword = this.Property.ControlType === "Password"
        }

        InitControls() {
            let p = this.Property
            if (!p.Action && p.ActionInvoke) { p.Action = new ns.actions.Index(this); p.Action.Invoke = p.ActionInvoke }

            this.ControlList = []
            this.ControlList.push(new SpanLabel(this.Property))
            this.ControlList.push(this.GetControl())
        }

        GetControl() {
            switch (this.Property.ControlType) {
                case "GridView": return new GridView(this.Property)
                case "DownList": return new DownList(this.Property)
                case "TextArea": return new TextArea(this.Property)
                case "Button": return new Button(this.Property)
                case "SpanText": return new SpanText(this.Property)
                case "TextSelect": return new TextSelect(Object.assign({ EnterControl: this.EnterControl }, this.Property))
                default: return new TextBox(Object.assign({ EnterControl: this.EnterControl }, this.Property))
            }
        }

        GetRowClassName() {
            return this.ControlList[1].GetRowClassName()
        }

        GetHtml() {
            let html = []
            let c = null
            let width = 0, height = 0

            !this.IsTd && html.push("<dl>")

            c = this.ControlList[0]
            if (this.IsTd) {
                html.push("<td style=\"text-align:right;\">" + c.GetHtml() + "</td>")
            }
            else {
                html.push("<dt>" + c.GetHtml() + "</dt>")
            }
            width += c.Width
            height = c.Height

            c = this.ControlList[1]
            if (this.IsTd) {
                html.push("<td style=\"text-align:left;\">" + c.GetHtml() + "</td>")
            }
            else {
                html.push("<dd>" + c.GetHtml() + "</dd>")
            }
            width += c.Width + 10
            height = c.Height > height ? c.Height : height

            this.Width = width
            this.Height = height

            !this.IsTd && html.push("</dl>")

            return html.join("")
        }

        GetValue() {
            return this.ControlList[1].GetValue()
        }

        Validate(value, blNull) {
            blNull = blNull === undefined ? true : blNull;
            const { IsNullable, Label, MaxLength, DataType } = this.Property
            let message = "", blSucceed = true

            if (IsNullable === false && Common.IsNullOrEmpty(value) && blNull) {
                message = Label + "不能为空！"
                blSucceed = false
            }

            if (blSucceed && MaxLength > 0 && value && value.length > MaxLength) {
                message = Label + "字符长度超过" + MaxLength + "个！"
                blSucceed = false
            }

            var isNumberType = DataType === "int" || DataType === "long" || DataType === "float" || DataType === "money";
            let c1 = this.ControlList[1];

            if (blSucceed && isNumberType && c1.ValidateNumber) {
                message = c1.ValidateNumber(value);
                if (message) blSucceed = false
            }

            if (blSucceed && DataType === "date" && c1.ValidateDate) {
                message = c1.ValidateDate(value);
                if (message) blSucceed = false
            }

            if (!blSucceed) Common.Alert(message)
            return blSucceed
        }

        SetValue(value) {
            this.ControlList[1].SetValue(value)
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.components
    const { DataSpan, LinkButton, LinkButtonList, DataCheckBox } = ns.controls
    const { HtmlTag } = ns.utils

    ns.components.DataItem = class DataItem extends Index {
        constructor(options) {
            super(options)

            this.BorderColor = this.BorderColor || "#a6c9e2"
            this.InitControls()
        }

        InitControls() {
            this.ControlList = []
            if (this.IsCheckBox) {
                this.CheckBoxControl = new DataCheckBox({ CheckChanged: (checked) => this.CheckChanged(checked) });
                this.ControlList.push(this.CheckBoxControl);
            }
            if (this.Data) {
                this.ControlList = this.ControlList.concat(this.Properties.map((p) => this.GetControl(p)))
            }
        }

        CheckChanged(checked) {
            if (checked) {
                const checkboxList = this.DataGrid.GetCheckBoxControlList();
                for (let i = 0; i < checkboxList.length; i++) {
                    if (!checkboxList[i].GetChecked()) { checked = false; break; }
                }
                if (checked) {
                    this.DataGrid.GridHeaderComponent.CheckBoxControl.SetChecked(true)
                }
            }
            else this.DataGrid.GridHeaderComponent.CheckBoxControl.SetChecked(false)
        }

        GetControl(p) {
            switch (p.ControlType) {
                case "LinkButton": return new LinkButton(Object.assign({ RowData: this.Data }, p))
                case "LinkButtonList": return new LinkButtonList(Object.assign({ RowData: this.Data }, p))
                default: return new DataSpan(Object.assign({ Value: this.Data[p.Name] }, p))
            }
        }

        InitTagObject() {
            this.TrTag = HtmlTag.GetById(this.Id)
        }

        EventLoad2() {
            HtmlTag.BindEvent(this.TrTag, "click", e => this.ClickRow(e))
        }

        DataLoad2() {
            if (this.Data && this.SelectIdList && this.SelectIdList.length > 0) {
                let id = this.Data[this.PrimaryKey]
                let list = this.SelectIdList.filter(f => f === id)
                if (list && list.length > 0) { this.DataSelected = true; this.SetSelectRow(); }
            }
        }

        ClickRow() {
            if (this.TrTag.Selected && !this.DataSelected) return
            this.DataSelected = false;
            if (this.TrTag.parentNode && this.TrTag.parentNode.childNodes.length > 0) {
                let n = null;
                for (let i = 0; i < this.TrTag.parentNode.childNodes.length; i++) {
                    n = this.TrTag.parentNode.childNodes[i];
                    n.Selected = false
                    HtmlTag.RemoveClass(n, "SelectTr")
                }
            }
            this.SetSelectRow()
        }

        SetSelectRow() {
            HtmlTag.AddClass(this.TrTag, "SelectTr")
            this.TrTag.Selected = true
            this.CheckBoxControl && this.CheckBoxControl.SetChecked();
        }

        GetValue() {
            return this.Data
        }

        GetHtml() {
            let html = []

            html.push(`<tr id=${this.Id} style="border-bottom:1px solid ${this.BorderColor}">`)

            let borderStyle = "", textAlign = "", chtml = "";
            this.ControlList.forEach((c, i) => {
                chtml = c.GetHtml();
                textAlign = c.TextAlign ? ` text-align:${c.TextAlign}` : "";
                borderStyle = i > 0 ? `border-left:1px solid ${this.BorderColor};` : ""
                html.push(`<td style="width:${c.ColumnWidth}px;${borderStyle}${textAlign}">`)
                html.push(chtml + "</td>")
            })

            html.push("</tr>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.components
    const { DataSpan, DataCheckBox, DownList } = ns.controls
    const { HtmlTag } = ns.utils

    ns.components.GridHeader = class GridHeader extends Index {
        constructor(options) {
            super(options)

            this.BorderColor = this.BorderColor || "#a6c9e2"
            this.Styles = this.Styles || { DivHeader: "DivHeader" }

            this.InitControls()
        }

        InitControls() {
            this.ControlList = []
            if (this.IsCheckBox) {
                this.CheckBoxControl = new DataCheckBox({ CheckChanged: (checked) => this.CheckChanged(checked) });
                this.ControlList.push(this.CheckBoxControl);
            }
            this.ControlList = this.ControlList.concat(this.Properties.map((p) => {
                if (p.Name === "DataStatusName") return new DownList(Object.assign({
                    ControlWidth: 60,
                    Options: [{ Value: "", Text: "状态" },
                    { Value: "0", Text: "未提交" },
                    { Value: "1", Text: "已提交" }],
                    IsEmpty: false,
                    StyleString: "height:22px;margin:1px 2px 1px 2px;",
                    Action: this.GetStatusChangeAction()
                }, p))
                return new DataSpan(Object.assign({ Value: p.Label || p.Name, IsLabel: true }, p))
            }))
        }

        GetStatusChangeAction() {
            var a = new ns.actions.Index(this);
            a.EventNames = ["change"]
            a.Invoke = (e, c) => {
                this.DataGrid.SearchAction.DataStatus = c.GetValue()
                this.DataGrid.SearchAction.Invoke(e, c)
            }
            return a
        }

        CheckChanged(checked) {
            this.DataGrid.GetCheckBoxControlList().forEach(c => c.SetChecked(checked))
        }

        InitTagObject() {
            this.TableTag = HtmlTag.GetById(this.Id)
        }

        GetGridWidth() {
            return HtmlTag.GetWindowWidth() - 40
        }

        GetHtml() {
            let html = []
            let width = this.IsFixedWidth ? this.Width : this.GetGridWidth()
            width = width > this.Width ? width : this.Width;

            html.push(`<div class="${this.Styles.DivHeader}"><div style="padding-right:20px;">`)
            html.push(`<table cellpadding="0" cellspacing="0" border="0" style="width:${width}px" id="${this.Id}"><thead><tr>`)
            let borderStyle = ""
            this.ControlList.forEach((c, i) => {
                borderStyle = i > 0 ? `border-left:1px solid ${this.BorderColor};` : ""
                html.push(`<th style="width:${c.ColumnWidth}px;${borderStyle}">`)
                html.push(c.GetHtml() + "</th>")
            })

            html.push("</tr></thead></table></div></div>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { Index, GridHeader, DataItem } = ns.components
    const { Connect } = ns.data.Index
    const { Common, HtmlTag } = ns.utils
    const { EditAction, DeleteAction, UpdateStatusAction, LookRejectRecordAction, LookOperationLogAction } = ns.actions


    ns.components.DataGrid = class DataGrid extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivGrid: "DivGrid", DivGridContent: "DivGridContent" }
        }

        InitControls() {
            this.DataList = []
            this.GetDataActions()

            this.Properties.forEach(p => {
                if (!p.Action && p.ActionInvoke) { p.Action = new ns.actions.Index(this); p.Action.Invoke = p.ActionInvoke }
            })
            this.Properties = this.Properties.sort((a, b) => a.X > b.X ? 1 : -1);
            this.IsDataStatus && this.Properties.push({ Name: "DataStatusName", Label: "状态", ColumnWidth: 70, TextAlign: "center" })
            this.DataActions.length > 0 && this.Properties.push({ Name: "Operation", Label: "操作", Actions: this.DataActions, ColumnWidth: this.DataActions.length * 40, ControlType: "LinkButtonList", TextAlign: "center" });

            this.ComputeWidth()

            this.GridHeaderComponent = new GridHeader({ Properties: this.Properties, DataGrid: this, IsCheckBox: this.IsCheckBox, Width: this.Width, IsFixedWidth: this.IsFixedWidth })
            this.ComponentList = [this.GridHeaderComponent]
        }

        ComputeWidth() {
            let width = 0;
            let iCount = 0
            this.Properties.forEach((p) => {
                width += p.ColumnWidth > 0 ? p.ColumnWidth : 0
                iCount += p.ColumnWidth > 0 ? 0 : 1
            })

            let gridWidth = 800

            if (iCount > 0 && gridWidth > width) {
                let columnWidth = Math.floor((gridWidth - width - 10) / iCount)

                this.Properties.forEach((p) => {
                    p.ColumnWidth = p.ColumnWidth > 0 ? p.ColumnWidth : columnWidth
                })
            }

            this.Width = this.Width || width;
        }

        GetDataActions() {
            this.DataActions = []

            this.IsDataStatus && this.DataActions.push(new UpdateStatusAction(this));
            this.IsDataStatus && this.DataActions.push(new LookRejectRecordAction(this));
            this.IsLookLog && this.DataActions.push(new LookOperationLogAction(this));
            this.IsEdit && this.DataActions.push(new EditAction(this))
            this.IsDelete && this.DataActions.push(new DeleteAction(this))

            return this.DataActions
        }

        GetGridWidth() {
            return HtmlTag.GetWindowWidth() - 40
        }

        GetHtml() {
            this.InitControls()

            let html = []

            let width = this.IsFixedWidth ? this.Width : this.GetGridWidth();
            width = width > this.Width ? width : this.Width;

            html.push(`<div class="${this.Styles.DivGrid}">`)

            html.push(this.ComponentList[0].GetHtml())

            let style = ""
            let styleList = []
            this.Height > 0 && styleList.push(`height:${this.Height - 60}px;`)
            if (styleList.length > 0) style = " style=\"" + styleList.join("") + "\""

            html.push(`<div class="${this.Styles.DivGridContent}"${style}>`)
            html.push(`<table cellpadding="0" cellspacing="0" border="0" style="width:${width}px;" id="${this.Id}">`)
            html.push("<tbody></tbody></table></div></div>")

            return html.join("")
        }

        InitTagObject() {
            this.TableTag = HtmlTag.GetById(this.Id)
            this.TableTbodyTag = Common.ArrayFirst(HtmlTag.Find(this.TableTag, "tbody"))
        }

        EventLoad2() {
            var divContent = this.TableTag.parentNode
            var tableHeader = this.GridHeaderComponent.TableTag

            HtmlTag.BindEvent(divContent, "scroll", (e) => {
                if (tableHeader.CurrentLeft !== e.target.scrollLeft) {
                    tableHeader.CurrentLeft = e.target.scrollLeft
                    tableHeader.style.left = -e.target.scrollLeft + "px"
                }
            })

            if (!this.IsLocalData && !this.Height) {
                this.SetReSize();
                HtmlTag.BindEvent(window, "resize." + this.Id, (e) => window.setTimeout(() => this.SetReSize(e), 10));
            }

            this.ChangeTdWidth();
        }

        DataLoad() {
            this.Properties.forEach((p) => {
                ns.data.Cache.GetPropertyDataList(p)
            })

            Connect((state) => {
                this.GetDataValue(state, "QueryResponse").then(res => {
                    res && this.SetQueryResponse()
                })
            })
        }

        ChangeTdWidth() {
            let key = "";
            let hthList = HtmlTag.Find(this.GridHeaderComponent.TableTag, "thead>tr>th");
            hthList.forEach(th => {
                HtmlTag.BindEvent(th, "mousedown", (e) => this.ThMouseDown(e));
                HtmlTag.BindEvent(th, "mousemove", (e) => this.ThMouseMove(e));
            })

            HtmlTag.BindEvent(window, "mousemove." + this.Id, (e) => this.WindowMouseMove(e));
            HtmlTag.BindEvent(window, "mouseup." + this.Id, (e) => this.WindowMouseUp(e));
        }

        ThMouseDown(e) {
            if (e.target.type === "checkbox") return;
            if (e.target.childNodes && e.target.childNodes[0].type === "checkbox") return;
            
            if (e.target.tagName.toLowerCase() === "select") return;

            if (this.IsCanMove) {
                this.IsThMouseDown = true;
                this.SelectTh = e.target.tagName === "span" ? e.target.parentNode : e.target;
                this.MoveLineId = this.MoveLineId || Common.CreateGuid();
                this.StartX = e.pageX;

                var offset = HtmlTag.GetOffSet(this.TableTag.parentNode)
                var top = offset.top - 32;
                var height = offset.height + 32;
                offset = HtmlTag.GetOffSet(this.SelectTh)
                var left = offset.left + offset.width;
                left = left < this.StartX ? this.StartX : left;
                let zIndex = Common.GetZIndex();
                var html = `<div class="DivMoveLine" id="${this.MoveLineId}" style="height:${height}px;top:${top}px;left:${left}px;z-index:${zIndex}"></div>`;
                HtmlTag.AppendHtml(document.body, html);
            }
            return false;
        }

        ThMouseMove(e) {
            if (e.target.type === "checkbox") return;
            if (e.target.childNodes && e.target.childNodes[0].type === "checkbox") return;

            if (e.target.tagName.toLowerCase() === "select") return;

            let th = e.target.tagName === "span" ? e.target.parentNode : e.target;

            var offset = HtmlTag.GetOffSet(th);
            var width = offset.width;

            if (this.IsThMouseDown) {
                HtmlTag.SetStyleValue(th, "cursor", "e-resize");
                this.IsMoveTh = true;
                var line = HtmlTag.GetById(this.MoveLineId);
                HtmlTag.SetStyleValue(line, "left", e.pageX + "px");
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                return false;
            }
            else if (e.pageX + 10 > offset.left + width - this.TableTag.parentNode.scrollLeft) {
                HtmlTag.SetStyleValue(th, "cursor", "e-resize");
                this.IsCanMove = true;
            }
            else {
                HtmlTag.SetStyleValue(th, "cursor", "default");
            }
        }

        WindowMouseMove(e) {
            if (this.IsThMouseDown) {
                document.unselectable = "on";
                document.onselectstart = function () {
                    return false;
                };
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                return;
            }
        }

        WindowMouseUp(e) {
            if (this.IsThMouseDown && this.IsMoveTh && this.SelectTh) {
                var x = e.pageX - this.StartX;
                var th = this.SelectTh;
                var offset = HtmlTag.GetOffSet(th);
                let w1 = offset.width;

                var width = w1 + x;
                width = width < 30 ? 30 : width;
                x = width - w1;

                this.SetThTdWidth(th, width);

                HtmlTag.SetStyleValue(th, "cursor", "default");

                offset = HtmlTag.GetOffSet(this.TableTag);
                width = offset.width + x;

                HtmlTag.SetWidth(this.TableTag, width);
                HtmlTag.SetWidth(this.GridHeaderComponent.TableTag, width);
            }

            HtmlTag.RemoveElement(document.body, HtmlTag.GetById(this.MoveLineId));
            this.IsThMouseDown = false;
            this.IsMoveTh = false;
            this.SelectTh = null;
            this.IsCanMove = false;
            document.unselectable = "off";
            document.onselectstart = null;
        }

        SetThTdWidth(selectth, width) {
            let index = -1, offSet = null;
            let hthList = HtmlTag.Find(this.GridHeaderComponent.TableTag, "thead>tr>th");
            let widthList = []
            hthList.forEach((th, i) => {
                if (th === selectth) index = i;
                offSet = HtmlTag.GetOffSet(th);
                widthList.push(offSet.width);
                HtmlTag.SetWidth(th, offSet.width);
            });
            HtmlTag.SetWidth(selectth, width);

            let rowList = HtmlTag.Find(this.TableTag, "tbody>tr");
            let td = null;
            let selectTdList = [];
            rowList.forEach(row => {
                for (let i = 0; i < row.childNodes.length; i++) {
                    td = row.childNodes[i];
                    if (i === index) selectTdList.push(td);
                    HtmlTag.SetWidth(td, widthList[i]);
                }
            });

            selectTdList.forEach(td => {
                HtmlTag.SetWidth(td, width);
            })
        }

        SetReSize(e) {
            let divGridView = this.TableTag.parentNode.parentNode.parentNode;
            let offSet = HtmlTag.GetOffSet(divGridView);
            let height = HtmlTag.GetWindowHeight()
            height = height - offSet.top - 90;
            height = height < 250 ? 250 : height;
            HtmlTag.SetHeight(this.TableTag.parentNode, height);
            if (!this.IsFixedWidth) {
                let width = this.GetGridWidth()
                if (width > this.Width) {
                    HtmlTag.SetWidth(this.TableTag, width);
                    HtmlTag.SetWidth(this.GridHeaderComponent.TableTag, width);
                }
            }
        }

        SaveData(d) {
            let key = this.Entity.PrimaryKey
            let list = this.DataList.filter(f => f[key] === d[key])
            if (list && list.length === 1) {
                list[0] = Object.assign(list[0], d)
            }
            else {
                this.DataList.push(d)
            }
            this.BindData([d[key]])
        }

        DeleteData(id) {
            let index = -1
            let key = this.Entity.PrimaryKey
            for (let i = 0; i < this.DataList.length; i++) {
                if (this.DataList[i][key] === id) {
                    index = i
                    break
                }
            }
            if (index >= 0) {
                this.DataList.splice(index, 1)
                this.BindData([])
            }
        }

        GetValue() { return this.DataList }

        SetValue(value) {
            if (value && value.length > 0) this.DataList = value.map(m => Object.assign({}, m))
            this.BindData([])
        }

        BindData(idList) {
            this.RowCount = this.DataList.length
            this.DataItemComponentList = this.DataList.map((d, i) => new DataItem({
                RowIndex: i,
                Properties: this.Properties,
                Data: d,
                IsCheckBox: this.IsCheckBox,
                IsFixedWidth: this.IsFixedWidth,
                PrimaryKey: this.Entity.PrimaryKey,
                DataGrid: this,
                SelectIdList: idList
            }))

            let html = this.DataItemComponentList.map((c, i) => c.GetHtml())
            HtmlTag.SetHtml(this.TableTbodyTag, html.join(""))

            this.DataItemComponentList.forEach((c) => {
                c.EventLoad()
                c.DataLoad()
            })

            if (this.IsLocalData && this.SpanRecord) {
                let record = `共 ${this.RowCount} 条记录`
                HtmlTag.SetHtml(this.SpanRecord, record)
            }

            this.IsCheckBox && this.GridHeaderComponent.CheckBoxControl.SetChecked(false)
        }

        SetQueryResponse() {
            let res = this.QueryResponse
            if (res == null) { return }

            if (this.IsFailMessage(res)) { return }

            if (res.DataList != null) {
                let idList = res.Ids ? res.Ids.split(",") : []
                this.DataList = res.DataList
                this.BindData(idList)
            }
        }

        GetCheckBoxControlList() {
            return this.DataItemComponentList.map(m => m.CheckBoxControl)
        }

        GetCheckedValue() {
            let dataList = [];
            this.DataItemComponentList.forEach(c => {
                if (c.CheckBoxControl.GetChecked()) dataList.push(c.Data)
            })
            return dataList;
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.components
    const { Connect } = ns.data.Index
    const { Button, SpanLabel, TextBox } = ns.controls
    const { PagingIndexQueryAction } = ns.actions
    const { Common, HtmlTag } = ns.utils

    ns.components.DataPaging = class DataPaging extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivPage: "DivPage" }
        }

        InitControls() {
            let entityButton = new Button({ Action: new PagingIndexQueryAction(this), Width: 50 })

            this.ControlList = []
            this.ControlList.push(this.GetPagingButton("PagingFirstAction"))//0
            this.ControlList.push(this.GetPagingButton("PagingPreAction"))//1
            this.ControlList.push(new SpanLabel({ Label: 1, IsColon: false, IsWidth: false, ClassName: "SpanIndex" }))//2
            this.ControlList.push(this.GetPagingButton("PagingNextAction"))//3
            this.ControlList.push(this.GetPagingButton("PagingLastAction"))//4
            this.ControlList.push(new SpanLabel({ Label: "到", IsColon: false, IsWidth: false }))//5
            this.ControlList.push(new TextBox({ Name: "IndexCount", MaxLength: 10, Width: 50, EnterControl: entityButton }))//6
            this.ControlList.push(new SpanLabel({ Label: "页", IsColon: false, IsWidth: false }))//7
            this.ControlList.push(entityButton)//8

            this._ctls = {
                First: this.ControlList[0],
                Pre: this.ControlList[1],
                Next: this.ControlList[3],
                Last: this.ControlList[4],
                IndexCount: this.ControlList[6],
                IndexQuery: this.ControlList[8]
            }
        }

        GetPagingButton(name) {
            return new Button({ Action: new ns.actions[name](this), ClassName: "Button", Width: 35 })
        }

        GetHtml() {
            this.IsPage && this.InitControls()

            let html = []
            html.push(`<div class="${this.Styles.DivPage}" style="display:none;" id="${this.Id}">`)
            html.push(`<div class=\"DivLeft\"><span class="SpanRecord" id="record_${this.Id}"></span></div>`)

            if (this.IsPage) {
                html.push("<div class=\"DivRight\"><ul>")
                html = html.concat(this.ControlList.map((c) => "<li>" + c.GetHtml() + "</li>"))
                html.push("</ul></div>")
            }
            html.push("</div>")
            return html.join("")
        }

        InitTagObject() {
            this.PageTag = HtmlTag.GetById(this.Id)
            this.SpanRecord = HtmlTag.GetById("record_" + this.Id)
        }

        DataLoad() {
            Connect((state) => {
                this.GetDataValue(state, "QueryResponse").then(res => {
                    res && this.SetQueryResponse()
                })
            })
        }

        SetQueryResponse() {
            let res = this.QueryResponse
            if (res == null) { return }

            if (res.PageRecord >= 0) this.PageRecord = res.PageRecord
            else if (!res.DataList || res.DataList.length === 0) this.PageRecord = 0

            if (this.IsPage) this.BindPage()
            else {
                this.PageRecord = res.DataList.length;
                this.BindRecord();
            }
        }

        BindRecord() {
            if (this.PageRecord == 0) {
                HtmlTag.SetHide(this.PageTag)
                return
            }

            //SpanRecord
            let record = `共 ${this.PageRecord} 条记录`

            HtmlTag.SetHtml(this.SpanRecord, record)
            HtmlTag.SetShow(this.PageTag)
        }

        BindPage() {
            this.PageIndex = this.SearchAction.PageIndex

            if (this.PageRecord == 0) {
                this.PageIndex = 1
                this.PageCount = 0

                HtmlTag.SetHide(this.PageTag)
                return
            }
            if (this.PageRecord % this.PageSize == 0) {
                this.PageCount = parseInt(this.PageRecord / this.PageSize)
            }
            else {
                this.PageCount = parseInt(this.PageRecord / this.PageSize) + 1
            }
            this.PageIndex = this.PageIndex < 1 ? 1 : this.PageIndex
            this.PageIndex = this.PageIndex > this.PageCount ? this.PageCount : this.PageIndex

            //SpanIndex
            this.ControlList[2].SetValue(this.PageIndex)

            //SpanRecord
            let startNum = (this.PageIndex - 1) * this.PageSize + 1
            let endNum = this.PageIndex * this.PageSize
            endNum = endNum > this.PageRecord ? this.PageRecord : endNum

            let record = `${startNum} - ${endNum} 共 ${this.PageCount} 页 ${this.PageRecord} 条记录`
            HtmlTag.SetHtml(this.SpanRecord, record)

            this.SetPageControlDisabled()

            HtmlTag.SetShow(this.PageTag)
        }

        SetPageControlDisabled() {
            let ed = this.JudgePage()

            ed.Enableds.forEach((e) => this._ctls[e].SetDisabled(false))
            ed.Disbleds.forEach((e) => this._ctls[e].SetDisabled(true))
        }

        JudgePage() {
            var ed = {}
            if (this.PageCount <= 1) {
                ed.Enableds = []
                ed.Disbleds = ["First", "Pre", "Next", "Last", "IndexCount", "IndexQuery"]
            }
            else if (this.PageIndex == 1) {
                ed.Enableds = ["Next", "Last", "IndexCount", "IndexQuery"]
                ed.Disbleds = ["First", "Pre"]
            }
            else if (this.PageIndex == this.PageCount) {
                ed.Enableds = ["First", "Pre", "IndexCount", "IndexQuery"]
                ed.Disbleds = ["Next", "Last"]
            }
            else {
                ed.Enableds = ["First", "Pre", "Next", "Last", "IndexCount", "IndexQuery"]
                ed.Disbleds = []
            }
            return ed
        }

        GetInputPageIndex() {
            //IndexCount
            let indexCountHtmlTag = this.ControlList[6]
            let indexCount = parseInt(indexCountHtmlTag.GetValue())
            if (indexCount > 0 && indexCount <= this.PageCount) {
                this.PageIndex = indexCount
            }
            else {
                Common.Alert("对不起，请输入1至" + this.PageCount + "之间的自然数页索引！").then(() => indexCountHtmlTag.Element.focus())
                return false
            }
            indexCountHtmlTag.SetValue("")

            return this.PageIndex
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.components
    const { Common, HtmlTag } = ns.utils
    const { DialogOkAction, DialogCancelAction } = ns.actions
    const { Buttons } = ns.components

    ns.components.Dialog = class Dialog extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DialogBackground: "DialogBackground", DivDialog: "DivDialog" }
            Common.InitValue(this, ["IsClosed", "IsOkButton"], true)
            this.DialogKey = "Dialog_" + this.Id.substring(0, 8);
        }

        InitControls() {
            this.Actions = this.Actions || this.GetActions()
            this.ButtonsComponent = new Buttons({ Actions: this.Actions })
            this.ComponentList = [this.ButtonsComponent]
            this.Width += 50
            this.Height += 100
        }

        GetActions() {
            let actions = []
            let okAction = new DialogOkAction(this)
            if (this.OkLabel) okAction.Label = this.OkLabel
            if (this.IsOkButton) actions.push(okAction)
            if (this.IsClosed) actions.push(new DialogCancelAction(this))
            return actions
        }

        GetHtml() {
            let width = HtmlTag.GetWindowWidth(), height = HtmlTag.GetWindowHeight(), zIndex = Common.GetZIndex()

            let html = []
            html.push(`<div class="${this.Styles.DialogBackground}" id="bg_${this.Id}" style="z-index:${zIndex};">`)
            html.push("</div>")

            let top = Math.round(height / 2 - this.Height / 2 - 30), left = Math.round(width / 2 - this.Width / 2)
            top = top < 10 ? 10 : top
            left = left < 10 ? 10 : left
            width = this.Width, height = this.Height, zIndex = Common.GetZIndex()

            html.push(`<div class="DivRadiusBorder ${this.Styles.DivDialog}" id="${this.Id}"`)
            html.push(` style="position:absolute;width:${width}px;height:${height}px;z-index:${zIndex};top:${top}px;left:${left}px;">`)
            html.push(this.GetHeaderHtml())

            height = height - 80
            html.push(`<div class="DivContent" style="height:${height}px;">${this.Html}</div>`)

            html.push(this.GetButtonsHtml())

            html.push("</div>")

            return html.join("")
        }

        GetButtonsHtml() {
            return "<div class=\"DivButton\">" + this.ButtonsComponent.GetHtml() + "</div>"
        }

        GetHeaderHtml() {
            let html = []

            html.push(`<div class="DivRadiusBorder DivTitleHeader" id="header_${this.Id}">`)
            html.push(`<span class="SpanTitle">${this.Title}</span>`)
            this.IsClosed && html.push("<a href=\"javascript:void(0);\" id=\"close_" + this.Id + "\"><span class=\"ui-icon ui-icon-closethick\"></span></a>")
            html.push("</div>")

            return html.join("")
        }

        Show() {
            this.InitControls()

            HtmlTag.AppendHtml(document.body, this.GetHtml())

            this.DivBackground = HtmlTag.GetById("bg_" + this.Id)
            this.DivDialog = HtmlTag.GetById(this.Id)

            this.IsClosed && HtmlTag.BindEvent(HtmlTag.GetById("close_" + this.Id), "click", () => this.Close())

            const header = HtmlTag.GetById("header_" + this.Id)
            HtmlTag.BindEvent(header, "mousedown", (e) => this.Down(e))
            HtmlTag.OffBindEvent(window, "mousemove." + this.DialogKey);
            HtmlTag.BindEvent(window, "mousemove." + this.DialogKey, (e) => this.Move(e))
            HtmlTag.BindEvent(header, "mouseup", (e) => this.Up(e))

            this.EventLoad()
            this.DataLoad()
        }

        Down(e) {
            this.IsStart = true
            let offset = HtmlTag.GetOffSet(this.DivDialog)
            this.StartX = e.pageX - offset.left
            this.StartY = e.pageY - offset.top
        }

        Move(e) {
            if (this.IsStart) {
                this.IsMove = true

                let width = HtmlTag.GetWindowWidth(), height = HtmlTag.GetWindowHeight()

                let dx = e.pageX - this.StartX
                let dy = e.pageY - this.StartY

                dx = dx + this.Width > width - 20 ? width - this.Width - 20 : dx
                dy = dy + this.Height > height - 20 ? height - this.Height - 20 : dy

                dx = dx < 1 ? 1 : dx
                dy = dy < 1 ? 1 : dy

                HtmlTag.SetStyle(this.DivDialog, { left: dx + "px", top: dy + "px" })
            }
        }

        Up(e) {
            if (this.IsMove) { this.IsStart = false }
        }

        Close() {
            HtmlTag.RemoveElement(document.body, this.DivDialog)
            HtmlTag.RemoveElement(document.body, this.DivBackground)
            HtmlTag.OffBindEvent(window, "mousemove." + this.DialogKey);
        }
    }

})($ns);
((ns) => {
    const { Common } = ns.utils

    ns.components.AlertConfirm = class AlertConfirm {
        constructor(options) {
            this.Id = Common.CreateGuid()

            options && Object.assign(this, options)

            this.Init()
        }

        Init() {
            this.Message = Common.IsNullOrEmpty(this.Message) ? "" : this.Message.toString()
            this.Message = this.Message.replace(/</g, "&lt;")
            this.Message = this.Message.replace(/>/g, "&gt;")

            this.ImgDivClassName = this.IsConfirm ? "DivConfirm" : "DivWarn"

            var width = 300
            var height = 100

            var width1 = this.Message.length * 15
            if (width1 > 500) {
                width = 500
                height = 150
            }
            else if (width1 > width) {
                width = width1
            }

            this.Width = width
            this.Height = height
        }

        GetHtml() {
            let html = []

            html.push("<table class=\"Alert\" border=\"0\"cellpadding=\"0\" cellspacing=\"0\"><tr align=\"left\">")
            html.push(`<td valign="top" width="40px"><div class="${this.ImgDivClassName}"></div></td>`)
            html.push(`<td valign="top"><div class="Text"><span>${this.Message}</span></div></td>`)
            html.push("</tr></table>")

            return html.join("")
        }

        ShowDialog(resolve) {
            let dialog = new ns.components.Dialog({
                Width: this.Width,
                Height: this.Height,
                Html: this.GetHtml(),
                IsClosed: false,
                OkAction: {
                    Invoke: () => {
                        dialog.Close()
                        resolve()
                    }
                },
                Title: this.IsConfirm ? "确认信息" : "提示信息"
            })

            let actions = [new ns.actions.DialogOkAction(dialog)]
            actions[0].IsOkFocus = true

            if (this.IsConfirm) {
                dialog.IsClosed = true
                actions.push(new ns.actions.DialogCancelAction(dialog))
            }
            dialog.Actions = actions

            dialog.Show()
        }

        Show() {
            return new Promise((resolve, reject) => {
                this.ShowDialog(resolve)
            })
        }
    }

})($ns);
((ns) => {
    const { Common, HtmlTag } = ns.utils

    ns.components.ExcelImport = class ExcelImport {
        constructor(options) {
            this.Id = Common.CreateGuid()

            options && Object.assign(this, options)
        }

        Import() {
            if (window.FileReader) {
                this.ExcelImportForFileReader()
            }
            else {
                Common.Alert("对不起，浏览器不支持Excel导入方式，请使用Chrome或Chrome内核浏览器！")
            }
        }

        ExcelImportForFileReader() {
            this.ExcelImportDialog = new ns.components.Dialog({
                Width: 600,
                Height: 100,
                Html: this.GetHtml(),
                Title: "Excel导入",
                OkLabel: "导入",
                OkAction: {
                    Invoke: (e, c) => { this.ExecExcelImport(c) }
                }
            })

            this.ExcelImportDialog.Show()
        }

        ExecExcelImport(c) {
            let fileInput = HtmlTag.GetById("file_" + this.Id)

            var files = fileInput.files
            if (files.length == 0) {
                Common.Alert("对不起，请选择Excel导入文件！")
                return
            }
            var file = files[0]
            var ft = ""

            if (file.type == "application/vnd.ms-excel") {
                ft = ".xls"
            }
            else if (file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                ft = ".xlsx"
            }
            if (ft == "") {
                Common.Alert("对不起，只能导入Excel文件！")
                return
            }
            if (file.size > 1024 * 1024) {
                Common.Alert("对不起，Excel文件大小不能大于1M")
                return
            }

            c.SetDisabled(true)
            this.SendFileRequest(file, ft, c)
        }

        GetHtml() {
            var html = [];
            html.push("<div class=\"DivText\"><dl><dt><span>Excel文件：</span></dt>")
            html.push("<dd><input type=\"file\" id=\"file_" + this.Id + "\"")
            html.push(" accept=\"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\" style=\"width:500px;\" class=\"TextBox\"></dd>")
            html.push("</dl></div>");
            return html.join("")
        }

        SendFileRequest(file, ft, c) {
            var url = "ExcelImportHandler.ashx?EntityName=" + this.Entity.Name + "&ft=" + ft

            let userId = Common.GetStorage("LoginUserId");
            if (!userId) Common.ToLogin();
            url = Common.AddURLParameter(url, "LoginUserId", userId);
            
            var fr = new FileReader()

            fr.onloadend = () => {
                this.Api.PostStreamFetch(url, fr.result).then(res => {
                    c.SetDisabled(false)

                    if (res.MessageList && res.MessageList.length > 0) {
                        this.ShowMessageList(res)
                        if (res.Message && res.Message.indexOf("操作成功") === 0) {
                            this.SearchAction.ExcelRefresh()
                            this.ExcelImportDialog.Close()
                        }
                    }
                    else if (res.Message) {
                        Common.Alert(unescape(res.Message)).then(() => {
                            if (res.Message.indexOf("操作成功") === 0) {
                                this.SearchAction.ExcelRefresh()
                                this.ExcelImportDialog.Close()
                            }
                        })
                    }

                }, res => {
                    c.SetDisabled(false)
                    const msg = res && res.message ? res.message : res
                    Common.Alert(msg)
                })
            }

            fr.readAsArrayBuffer(file)
        }

        ShowMessageList(data) {
            var html = []
            var colName = "错误提示"
            html.push("<div class=\"DivList\">")
            if (!Common.IsNullOrEmpty(data.Message)) {
                html.push(`<div class="DivText"><span>${data.Message}</span></div>`)
                if (data.Message.indexOf("操作成功") == 0) {
                    colName = "信息"
                }
            }
            html.push("<div class=\"DivData\"><div class=\"DivGridView\">")
            html.push("<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">")
            html.push(`<thead><tr><td width=\"40\">行号</td><td width=\"800\">${colName}</td></tr></thead>`)
            html.push("<tbody>")
            data.MessageList.forEach(item => {
                html.push("<tr>")
                html.push(`<td>${item.RowNum}</td>`)
                html.push(`<td>${item.Message}</td>`)
                html.push("</tr>")
            })
            html.push("</tbody></table></div></div></div>")

            this.ExcelMessageDialog = new ns.components.Dialog({
                Width: 850,
                Height: 500,
                Html: html.join(""),
                Title: "Excel导入提示信息",
                IsOkButton: false
            })

            this.ExcelMessageDialog.Show()
        }
    }

})($ns);

((ns) => {
    const { Index } = ns.components
    const { SpanLabel, LinkButton } = ns.controls
    const { ChangePasswordAction } = ns.actions

    ns.components.Login = class Login extends Index {
        constructor(options) {
            super(options)

            this.Init()
        }

        Init() {
            const { LoginUser } = this.Page

            let loginInfo = `${LoginUser.LoginName}，欢迎您`
            if (LoginUser.LastLoginDate) {
                loginInfo = `${loginInfo}，上一次登录时间：${LoginUser.LastLoginDate}`
            }
            else {
                loginInfo = `${loginInfo}，第一次登录系统`
            }

            this.ControlList = []
            this.ControlList.push(new SpanLabel({ IsWidth: false, IsColon: false, Label: loginInfo }))
            this.ControlList.push(new LinkButton({ Action: new ChangePasswordAction(this.Page) }))
        }

        GetHtml() {
            let html = []

            html.push(`<div class="DivLogin"><ul>`)
            html = html.concat(this.ControlList.map((c) => "<li>" + c.GetHtml() + "</li>"))
            html.push(`<li><a href="Index.aspx?page=Default">首页</a></li>`)
            let loginName = escape("登录")
            let id = this.Page.LoginUser ? this.Page.LoginUser.UserId : ""
            html.push(`<li><a href="Index.aspx?page=${loginName}">退出</a></li>`)
            html.push("</ul></div>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.components
    const { Common, HtmlTag } = ns.utils

    ns.components.Menu = class Menu extends Index {
        constructor(options) {
            super(options)
        }

        GetHtml() {
            let html = []

            html.push(`<div class="DivMenu" id=${this.Id}>`)
            html.push(`<div class="DivMenu1">`)
            html.push("</div>")
            html.push(`<div class="DivMenu2">`)
            html.push("</div>")
            html.push("</div>")

            return html.join("")
        }

        InitTagObject() {
            this.MenuTag = HtmlTag.GetById(this.Id)
        }

        DataLoad2() {
            this.GetFirstMenuList().then(() => {
                this.GetPageMenuList().then(() => {
                    this.GetAdminMenu().then(() => {
                        this.SetMenuList()
                    })
                })
            })
        }

        GetFirstMenuList() {
            return this.GetKeyValueList("菜单", "=", "菜单").then(res => {
                this.FirstMenuList = []
                if (res != null) {
                    let data = Common.ArrayFirst(res)
                    if (data) {
                        this.FirstMenuList = Common.Split(data["值"], ["，", ","]).map(m => { return { Name: m } })
                    }
                }
                return Promise.resolve()
            })
        }

        GetKeyValueList(cacheName, logic, value) {
            return ns.data.Cache.GetDataList(cacheName, "键值配置", ["键名", "值"], [{ Name: "键名", Logic: logic, Value: value }])
        }

        GetAdminMenu() {
            let value = "管理员，管理员菜单"

            return this.GetKeyValueList("管理员菜单", "in", value).then(res => {
                this.AdminUserList = []
                this.AdminMenuList = []
                if (res != null) {
                    res.forEach(item => {
                        if (item["键名"] === "管理员") this.AdminUserList = Common.Split(item["值"], ["，", ","])
                        if (item["键名"] === "管理员菜单") this.AdminMenuList = Common.Split(item["值"], ["，", ","])
                    })
                    if (this.Page.LoginUser) {
                        let list = this.AdminUserList.filter(f => Common.IsEquals(f, this.Page.LoginUser.LoginName))
                        this.IsAdmin = list.length === 1
                        this.SetLogoutHref()
                    }
                }
                return Promise.resolve()
            })
        }

        SetLogoutHref() {
            if (this.IsAdmin) {
                let logout = HtmlTag.GetById("alogout_" + this.Page.LoginUser.UserId);
                let href = HtmlTag.GetAttribute(logout, "href")
                if (href) {
                    href += "&debug=true";
                    HtmlTag.SetAttribute(logout, "href", href);
                }
            }
        }

        GetPageMenuList() {
            let value = this.FirstMenuList.map(m => `菜单-${m.Name}`)

            return this.GetKeyValueList("页面菜单", "in", value.join(",")).then(res => {
                this.PageDataList = []
                if (res != null) {
                    res.forEach(item => {
                        Common.Split(item["值"], ["，", ","]).forEach(v => {
                            this.PageDataList.push({ Name: v, MenuName: item["键名"].replace("菜单-", "") })
                        })
                    })
                }
                return Promise.resolve()
            })
        }

        SetMenuList() {
            this.MenuList = []

            let firstMenuList = []
            let list = null, selected2 = false, selected = false, name = ""

            if (this.IsAdmin) {
                firstMenuList = this.FirstMenuList
            }
            else {
                this.FirstMenuList.forEach(m => {
                    list = this.AdminMenuList.filter(f => Common.IsEquals(f, m.Name))
                    list.length === 0 && firstMenuList.push(m)
                })
            }

            firstMenuList.forEach(m => {
                list = this.PageDataList.filter(f => f.MenuName === m.Name)
                if (list && list.length > 0) {
                    selected = false

                    m.ChildMenuList = list.map(m2 => {
                        name = m2.Name
                        selected2 = this.Page.Name === name
                        if (selected2) selected = true
                        return {
                            Name: name,
                            Selected: selected2,
                            Url: this.GetUrl(name)
                        }
                    })

                    m.Selected = selected
                    m.Id = Common.CreateGuid()

                    this.MenuList.push(m)
                }
            })

            this.LoadMenuHtml(firstMenuList)
        }

        LoadMenuHtml(firstMenuList) {
            HtmlTag.SetHtml(this.MenuTag, this.GetMenuHtml())
            firstMenuList.forEach(m => {
                HtmlTag.BindEvent(HtmlTag.GetById(m.Id), "click", () => {
                    firstMenuList.forEach(m2 => {
                        m2.Selected = m.Id === m2.Id
                    })
                    this.LoadMenuHtml(firstMenuList)
                })
            })
        }

        GetUrl(pageName) {
            return "Index.aspx?page=" + escape(pageName)
        }

        GetMenuHtml() {
            let html = []

            html.push(`<div class="DivMenu1"><div class="DivMenuRight">`)

            let menu = null
            this.MenuList.forEach(m => {
                if (m.Selected) {
                    html.push(`<p>${m.Name}</p>`)
                    menu = m
                }
                else {
                    html.push(`<a href="javascript:void(0);" id=${m.Id}>${m.Name}</a>`)
                }
            })

            html.push("</div></div>")
            html.push(`<div class="DivMenu2"><ul>`)

            let className = ""
            if (menu && menu.ChildMenuList.length > 0) {
                menu.ChildMenuList.forEach(m => {
                    if (m.Selected) className = " class=\"Active\""
                    else className = ""
                    html.push(`<li><a href="${m.Url}"${className}>${m.Name}</a></li>`)
                })
            }

            html.push("</ul></div>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { Common, HtmlTag } = ns.utils

    ns.components.Loading = class Loading {
        constructor() {
            this.Id = Common.CreateGuid();
        }

        GetHtml() {
            let zIndex= Common.GetZIndex();

            let html = []
            html.push(`<div class="DivLoading" id="${this.Id}" style="z-index:${zIndex};">`)
            html.push("</div>")

            return html.join("")
        }

        Show() {
            HtmlTag.AppendHtml(document.body, this.GetHtml())

            this.DivLoading = HtmlTag.GetById(this.Id)
        }

        Close() {
            HtmlTag.RemoveElement(document.body, this.DivLoading);
        }
    }

})($ns);
((ns) => {
    const { Common, HtmlTag } = ns.utils

    ns.components.SelectGridView = class SelectGridView {
        constructor(options) {
            this.Id = Common.CreateGuid();
            options && Object.assign(this, options)

            Common.InitValue(this, ["IsSingle"], true)
        }

        Load() {
            this.Page = new ns.pages.DialogListPage({
                Width: this.Width,
                Height: this.Height,
                GridWidth: this.GridWidth,
                GridHeight: this.GridHeight,
                Title: this.Title,
                IsPage: this.IsPage || false,
                Entity: this.Entity,
                OkAction: { Invoke: (e, c) => this.OkActionInvoke(e, c) },
                IsCheckBox: !this.IsSingle
            })
            this.Page.Load()
        }

        OkActionInvoke(e, c) {
            const dataList = this.Page.GetDataGridCheckedValue();
            if (dataList.length === 0) {
                Common.Alert("请选择数据行！");
                return;
            }
            if (this.SetSelectRows) this.SetSelectRows(dataList).then(() => this.Page.ListDialog.Close())
            else {
                var len = this.SelectDataGrid.DataList.length

                var list = null, newDataList = [], i = 0
                dataList.forEach(p => {
                    list = this.SelectDataGrid.DataList.filter(f => f[this.Entity.PrimaryKey] === p[this.Entity.PrimaryKey])
                    if (list.length === 0) {
                        i++
                        newDataList.push(this.SetSelectRowData(p, i, len))
                    }
                })

                if (newDataList.length > 0) {
                    this.SelectDataGrid.DataList = this.SelectDataGrid.DataList.concat(newDataList)
                    this.SelectDataGrid.SetValue()
                }

                this.Page.ListDialog.Close()
            }
        }
    }

})($ns);
((ns) => {
    const { Common } = ns.utils

    ns.layouts.Index = class Index {
        constructor(options) {
            this.Id = Common.CreateGuid()
            this.ComponentList = []

            options && Object.assign(this, options)
        }

        ExpandRowComponents() { }

        GetRowList() {
            let rowCount = 0
            this.ComponentList.forEach(c => { if (c.Property.X > rowCount) rowCount = c.Property.X })
            this.RowCount = rowCount

            this.RowList = []
            let row = null, list = null, className = null

            for (let i = 0; i < rowCount; i++) {
                list = this.ComponentList.filter(f => f.Property.X === i + 1)
                list = list.sort((a, b) => a.Property.Y > b.Property.Y ? 1 : -1)
                if (list.length > 0 && list[0].GetRowClassName) className = list[0].GetRowClassName()
                row = { Components: list, ClassName: className }
                this.ExpandRowComponents(row, i)

                if (row.Components.length > 0) this.RowList.push(row)
            }

            return this.RowList
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.layouts

    ns.layouts.Search = class Search extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivSearch: "DivSearch", DivRow: "DivRow" }
        }

        GetHtml() {
            this.GetRowList()

            let html = []

            html.push(`<div class="${this.Styles.DivSearch}">`)

            html = html.concat(this.RowList.map((r) => this.GetRowHtml(r)))

            html.push("</div>")

            return html.join("")
        }

        GetRowHtml(r) {
            let html = []

            html.push(`<div class="${this.Styles.DivRow}"><ul>`)

            html = html.concat(r.Components.map((c) => "<li>" + c.GetHtml() + "</li>"))

            html.push("</ul></div>")

            return html.join("")
        }

        ExpandRowComponents(row, i) {
            if (i === this.RowCount - 1 && this.ButtonComponentList && this.ButtonComponentList.length > 0) {
                row.Components = row.Components.concat(this.ButtonComponentList)
            }
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.layouts

    ns.layouts.GridView = class GridView extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivGridView: "DivGridView" }
        }

        GetHtml() {
            let html = []

            html.push(`<div class="${this.Styles.DivGridView}">`)

            html.push(this.DataGridComponent.GetHtml())

            if (this.DataPagingComponent) {
                html.push(this.DataPagingComponent.GetHtml())
            }
            html.push("</div>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.layouts

    ns.layouts.EditLayout = class EditLayout extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivEdit: "DivEdit", DivRow: "DivRow" }

            this.Width = 0
            this.Height = 0
        }

        GetHtml() {
            this.GetRowList()

            let html = []

            html.push(`<div class="${this.Styles.DivEdit}">`)
            html = html.concat(this.RowList.map((r) => this.GetRowHtml(r)))
            html.push("</div>")

            return html.join("")
        }

        GetRowHtml(r) {
            let html = []
            let width = 0, height = 0

            let className = r.ClassName ? r.ClassName : this.Styles.DivRow
            html.push(`<div class="${className}"><ul>`)

            r.Components.forEach((c) => {
                html.push("<li>" + c.GetHtml() + "</li>")
                width += c.Width
                height = c.Height > height ? c.Height : height
            })

            this.Width = width > this.Width ? width : this.Width
            this.Height += height

            html.push("</ul></div>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.layouts

    ns.layouts.DataOperationLayout = class DataOperation extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivOperation: "DivOperation" }
        }

        GetHtml() {
            let html = []

            html.push(`<div class="${this.Styles.DivOperation}">`)

            html.push(this.OpeartionComponent.GetHtml())

            html.push("</div>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.layouts

    ns.layouts.MenuLayout = class MenuLayout extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivLoginMenu: "DivLoginMenu" }
        }

        GetHtml() {
            let html = []

            html.push(`<div class="${this.Styles.DivLoginMenu}">`)

            html.push(this.LoginComponent.GetHtml())
            html.push(this.MenuComponent.GetHtml())

            html.push("</div>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.layouts

    ns.layouts.TableLayout = class EditLayout extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivTable: "DivTable" }

            this.Width = 0
            this.Height = 0
        }

        GetHtml() {
            this.GetRowList()

            let html = []

            html.push(`<div class="${this.Styles.DivTable}">`)
            html.push(`<table cellpadding="0" cellspacing="0" border="0" style="width:100%" id="${this.Id}"><tbody>`)
            html = html.concat(this.RowList.map((r) => this.GetRowHtml(r)))
            html.push("</tbody></table></div>")

            return html.join("")
        }

        GetRowHtml(r) {
            let html = []

            html.push(`<tr">`)

            r.Components.forEach((c) => {
                html.push(c.GetHtml())
            })

            html.push("</tr>")

            return html.join("")
        }
    }

})($ns);
((ns) => {
    const { Common } = ns.utils
    const { SearchAction, NewAddActions } = ns.actions

    ns.pages.Index = class Index {
        constructor(options) {
            this.Id = Common.CreateGuid()
            this.Entity = { Properties: [] }

            options && Object.assign(this, options)

            this.Styles = this.Styles || { HtmlPage: "HtmlPage" }

            this.InitEntity();

            this.Entity.Properties.forEach((p) => this.InitProperty(p))

            this.KeyName = this.PageName + "_" + this.Entity.Id
        }

        Load() {
            this.PageInit()
            this.PageLoad()
        }

        PageInit() { }

        InitEntity() {
            this.Entity.Label = this.Entity.Label || this.Entity.Name
            this.Entity.Id = this.Entity.Id || Common.CreateGuid();
            Common.InitValue(this.Entity, ["IsSelectKey"], true)
        }

        InitProperty(p) {
            Common.InitValue(p, ["IsSearch"], p.SearchOptions !== undefined)
            Common.InitValue(p, ["IsData"], p.DataOptions !== undefined)
            Common.InitValue(p, ["IsEdit"], p.EditOptions !== undefined)
            Common.InitValue(p, ["IsVisible"], true)
            p.Label = p.Label || p.Name
        }

        PageLoad() { }
    }

})($ns);
((ns) => {
    const { Common, HtmlTag } = ns.utils
    const { Index } = ns.pages
    const { Search, GridView, DataOperationLayout, MenuLayout, TableLayout } = ns.layouts
    const { Buttons, PropertyItem, DataGrid, DataPaging } = ns.components
    const { SearchAction, NewAddAction, ExcelExportAction, ExcelImportAction, LookOperationLogAction2, BatchDeleteAction, BatchSubmitAction, BatchRejectAction } = ns.actions

    ns.pages.ListPage = class ListPage extends Index {
        constructor(options) {
            super(options)

            this.Title = this.Title || this.Entity.Label + "列表"
            if (!this.IsDialog) document.title = this.Title

            const names = ["IsPage", "IsBatchSubmit", "IsBatchReject", "IsBatchDelete", "IsNewAdd", "IsExcelExport", "IsExcelImport", "IsEdit", "IsDelete2", "IsDataRight", "IsDataStatus", "IsLookLog"]
            Common.InitValue(this, names, true)
            this.PageSize = this.PageSize || 20
            this.IsDefault = this.Name === "Default";
        }

        PageInit() {
            if (!this.IsDialog) this.QueryString = Common.GetQueryString()
            this.SetLoginUser();

            ns.data.Index.InitListPageEntityState(this.KeyName)

            if (!this.IsDialog) this.MenuLayout = new MenuLayout(this.GetMenuComponents())
            if (this.IsDefault) return;

            this.Entity.ExpandPageInit && this.Entity.ExpandPageInit.call(this, ns)

            this.SearchProperties = this.Entity.Properties.filter((p) => p.IsSearch).map((p) => Object.assign({}, p, p.SearchOptions))
            this.DataProperties = this.Entity.Properties.filter((p) => p.IsData && p.IsVisible).map((p) => Object.assign({}, p, p.DataOptions))
            this.SelectNames = this.Entity.Properties.filter((p) => p.IsData).map((p) => p.Name)

            this.SerachLayout = new Search(this.GetSearchComponents())
            this.GridViewLayout = new GridView(this.GetGridViewComponents())
            this.DataOperationLayout = new DataOperationLayout(this.GetOperationComponents())
        }

        SetLoginUser() {
            var loginInfo = Common.GetStorage("LoginInfo");
            if (!loginInfo) {
                Common.ToLogin();
            }
            else {
                this.LoginUser = JSON.parse(loginInfo);
            }
        }

        GetMenuComponents() {
            this.MenuComponent = new ns.components.Menu({ Page: this })
            this.LoginComponent = new ns.components.Login({ Page: this })
            return { MenuComponent: this.MenuComponent, LoginComponent: this.LoginComponent }
        }

        GetOperationComponents() {
            const { IsExcelExport, IsExcelImport, IsDelete2, IsDataStatus, IsLookLog, IsBatchDelete, IsBatchSubmit, IsBatchReject } = this
            this.OpeartionActions = []

            let blDataRight3 = this.LoginUser && this.LoginUser.DataRight === 3

            IsExcelExport && this.OpeartionActions.push(new ExcelExportAction(this))
            IsExcelImport && this.OpeartionActions.push(new ExcelImportAction(this))
            IsDelete2 && IsBatchDelete && this.OpeartionActions.push(new BatchDeleteAction(this))
            IsDataStatus && IsBatchSubmit && this.OpeartionActions.push(new BatchSubmitAction(this))
            IsDataStatus && IsBatchReject && blDataRight3 && this.OpeartionActions.push(new BatchRejectAction(this))
            IsLookLog && blDataRight3 && this.OpeartionActions.push(new LookOperationLogAction2(this))

            this.OperationButtonsComponent = new Buttons({ Actions: this.OpeartionActions })

            return { OpeartionComponent: this.OperationButtonsComponent }
        }

        GetOrderByList() {
            if (this.Entity.OrderByList) return this.Entity.OrderByList;
            let orderByList = [{ Name: "CreateDate", IsDesc: true }]
            return orderByList
        }

        GetIsCheckBox() {
            if (this.IsCheckBox !== undefined) return this.IsCheckBox
            if (!this.IsDelete2 && !this.IsDataStatus) return false

            let blCheckBox = false
            blCheckBox = this.IsDelete2 && this.IsBatchDelete
            if (!blCheckBox) blCheckBox = this.IsDataStatus && (this.IsBatchReject || this.IsBatchSubmit)

            return blCheckBox
        }

        GetGridViewComponents() {
            this.DataGridComponent = new DataGrid({
                Entity: this.Entity,
                Properties: this.DataProperties,
                KeyName: this.KeyName,
                IsEdit: this.IsEdit,
                IsDelete: this.IsDelete2,
                IsDataRight: this.IsDataRight,
                IsDataStatus: this.IsDataStatus,
                IsLookLog: this.IsLookLog,
                LoginUser: this.LoginUser,
                IsCheckBox: this.GetIsCheckBox(),
                IsFixedWidth: this.IsFixedWidth,
                SearchAction: this.SearchActions[0]
            })
            if (this.IsDialog && this.GridWidth) {
                this.DataGridComponent.Width = this.GridWidth;
                this.DataGridComponent.Height = this.GridHeight;
            }

            this.DataPagingComponent = new DataPaging({
                KeyName: this.KeyName,
                PageSize: this.PageSize,
                IsPage: this.IsPage,
                SearchAction: this.SearchActions[0],
            })

            return { DataGridComponent: this.DataGridComponent, DataPagingComponent: this.DataPagingComponent }
        }

        GetSearchComponents() {
            this.SearchButtonsComponent = new Buttons({ Actions: this.GetSearchActions() })
            this.SearchComponents = this.SearchProperties.filter(f => f.IsVisible).map((p) => new PropertyItem({
                Property: p,
                EnterControl: this.SearchButtonsComponent.ControlList[0]
            }))

            return { ComponentList: this.SearchComponents, ButtonComponentList: [this.SearchButtonsComponent] }
        }

        GetSearchActions() {
            this.SearchActions = []

            this.SearchActions.push(new SearchAction(this))
            this.IsNewAdd && this.SearchActions.push(new NewAddAction(this))

            return this.SearchActions
        }

        PageLoad() {
            HtmlTag.SetHtml(document.body, this.GetHtml())

            this.EventLoad()
            this.DataLoad()

            this.SearchActions && this.SearchActions[0].Invoke()
        }

        GetHtml() {
            let html = []
            html.push(`<div class="${this.Styles.HtmlPage}">`)

            this.MenuLayout && html.push(this.MenuLayout.GetHtml())

            if (!this.IsDefault) {
                html.push(this.SerachLayout.GetHtml())
                this.OpeartionActions.length > 0 && html.push(this.DataOperationLayout.GetHtml())
                html.push(this.GridViewLayout.GetHtml())
            }
            else {
                html.push(`<div id="divDefault_${this.Id}"></div>`);
            }

            html.push("</div>")
            return html.join("")
        }

        EventLoad() {
            this.MenuComponent && this.MenuComponent.EventLoad()
            this.LoginComponent && this.LoginComponent.EventLoad()
            if (this.IsDefault) return

            this.SearchComponents.forEach((c) => c.EventLoad())
            this.SearchButtonsComponent.EventLoad()

            this.DataGridComponent.EventLoad()
            this.DataPagingComponent && this.DataPagingComponent.EventLoad()

            this.SearchActions[0].InitConditionList = this.GetSearchCondition()

            this.OpeartionActions.length > 0 && this.OperationButtonsComponent.EventLoad()
        }

        DataLoad() {
            this.MenuComponent && this.MenuComponent.DataLoad()
            this.LoginComponent && this.LoginComponent.DataLoad()
            if (this.IsDefault) {
                this.SetDefaultHtml();
                return;
            }

            this.SearchComponents.forEach((c) => c.DataLoad())
            this.SearchButtonsComponent.DataLoad()

            this.DataGridComponent.DataLoad()
            this.DataPagingComponent && this.DataPagingComponent.DataLoad()

            this.OpeartionActions.length > 0 && this.OperationButtonsComponent.DataLoad()
        }

        SetDefaultHtml() {
            ns.data.Cache.GetDataList("首页配置", "默认页", ["属性名", "属性值", "行位置", "列位置"], []).then(res => {
                if (res != null) {
                    let devDefault = HtmlTag.GetById("divDefault_" + this.Id);
                    HtmlTag.SetHtml(devDefault, this.GetDefaultHtml(res));

                    this.DefaultPropertyComponents.forEach((c) => {
                        c.EventLoad()
                        c.DataLoad()
                    })
                }
            });
        }

        GetDefaultHtml(dataList) {
            const propertyList = dataList.map(m => {
                return {
                    Name: m["属性名"],
                    Label: m["属性名"],
                    ControlType: "SpanText",
                    IsWidth: false,
                    DefaultValue: m["属性值"],
                    X: m["行位置"],
                    Y: m["列位置"]
                }
            })

            this.DefaultPropertyComponents = propertyList.map((p) => new PropertyItem({ Property: p, IsTd: true, Page: this }))
            this.DefaultPageTableLayout = new TableLayout({ ComponentList: this.DefaultPropertyComponents })

            return this.DefaultPageTableLayout.GetHtml()
        }

        GetSearchCondition() {
            let conditionList = [];
            let blValidate = true
            let value = "", c = null

            for (let i = 0; i < this.SearchComponents.length; i++) {
                c = this.SearchComponents[i]
                value = c.GetValue()
                if (c.Validate(value, false) === false) {
                    blValidate = false
                    break
                }
                if (!Common.IsNullOrEmpty(value)) {
                    conditionList.push({
                        Name: c.Property.Name,
                        Logic: c.Property.Logic || "=",
                        Value: c.GetValue() || ""
                    })
                }
            }

            if (!blValidate) return false

            this.SearchProperties.filter(f => !f.IsVisible).forEach(p => {
                conditionList.push({
                    Name: p.Name,
                    Logic: p.Logic || "=",
                    Value: p.DefaultValue || ""
                })
            })

            return conditionList;
        }

        SetInitConditionList(conditionList) {
            const condition = {}
            conditionList.forEach(c => condition[c.Name] = c.Value)
            let value = ""
            this.SearchComponents.forEach(c => {
                value = condition[c.Property.Name] === undefined ? "" : condition[c.Property.Name]
                c.SetValue(value)
            })
        }

        GetHeaderInfoList() {
            return this.DataProperties.map((p) => { return { Name: p.Name, Label: p.Label } })
        }

        GetDataGridCheckedValue() {
            return this.DataGridComponent.GetCheckedValue()
        }
    }

})($ns);
((ns) => {
    const { Index } = ns.pages
    const { Common } = ns.utils
    const { PropertyItem, Dialog } = ns.components
    const { EditLayout } = ns.layouts
    const { CreateAction, UpdateAction } = ns.actions

    ns.pages.EditPage = class extends Index {
        constructor(options) {
            options.PageName = options.PageName || "EditPage"
            super(options)

            Common.InitValue(this, ["IsDialog"], true)
            this.Title = this.Title || (this.IsUpdate ? this.IsLook ? "查看" : "修改" : "新增") + this.Entity.Label
            this.Styles.EditPage = this.Styles.EditPage || "EditPage"
        }

        PageInit() {
            ns.data.Index.InitEditPageEntityState(this.KeyName)

            this.Entity.ExpandPageInit && this.Entity.ExpandPageInit.call(this, ns)
            this.EditProperties = this.Entity.Properties.filter((p) => p.IsEdit).map((p) => Object.assign({ IsVisible: true }, p, p.EditOptions))

            this.EditLayout = new EditLayout(this.GetEditComponents())

            this.IndexAction = new ns.actions.Index(this)
        }

        GetEditComponents() {
            this.EditComponents = this.EditProperties.filter(f => f.IsVisible).map((p) => new PropertyItem({ Property: p, Page: this }))

            return { ComponentList: this.EditComponents }
        }

        PageLoad() {
            if (this.IsDialog) {
                let html = this.GetHtml()
                let width = this.Width > 0 ? this.Width : this.EditLayout.Width
                let height = this.Height > 0 ? this.Height : this.EditLayout.Height

                this.EditDialog = new ns.components.Dialog({
                    Width: width,
                    Height: height,
                    Html: html,
                    Title: this.Title,
                    IsOkButton: !this.IsLook,
                    OkAction: this.IsUpdate ? new UpdateAction(this) : new CreateAction(this)
                })

                if (this.OkAction) this.EditDialog.OkAction = this.OkAction
                if (this.IsDataStatus && !this.IsLook) {
                    this.EditDialog.Actions = this.GetDialogActions(this.EditDialog);
                }

                this.EditDialog.Show()
            }
            else {
                HtmlTag.SetHtml(document.body, this.GetHtml())
            }
            this.EventLoad()
            this.DataLoad()
        }

        GetDialogActions(dialog) {
            let actions = []
            actions.push(new ns.actions.DialogSaveAction(dialog))
            actions.push(new ns.actions.DialogSubmitAction(dialog))
            actions.push(new ns.actions.DialogCancelAction(dialog))
            return actions
        }

        GetHtml() {
            let html = []
            html.push(`<div class="${this.Styles.EditPage}">`)

            html.push(this.EditLayout.GetHtml())

            html.push("</div>")
            return html.join("")
        }

        EventLoad() {
            this.EditComponents.forEach((c) => c.EventLoad())
        }

        DataLoad() {
            this.EditComponents.forEach((c) => c.DataLoad())

            if (this.IsUpdate) {
                if (this.IsLocalData) {
                    this.Entity.EntityData = this.RowData
                    this.EditComponents.forEach(c => c.SetValue(this.RowData[c.Property.Name]))
                }
                else {
                    this.GetEntityData()
                }
            }
        }

        GetEntityData() {
            this.IndexAction.GetEntityData(this.Entity, this.EditProperties.map(p => p.Name), this.RowData[this.Entity.PrimaryKey]).then(res => {
                if (res.IsSuccess) {
                    let data = Common.ArrayFirst(res.Data.DataList)
                    if (data) {
                        this.EntityData = data;
                        this.Entity.EntityData = data
                        this.Entity.ExpandGetEditData && this.Entity.ExpandGetEditData.call(this, data, ns)
                        this.EditComponents.forEach(c => c.SetValue(data[c.Property.Name]))
                    }
                }
                else {
                    Common.Alert(res.Message)
                }
            })
        }

        GetEditData() {
            let data = {}
            if (this.IsUpdate) {
                data[this.Entity.PrimaryKey] = this.RowData[this.Entity.PrimaryKey]
                data.RowVersion = this.RowData.RowVersion
            }
            let blValidate = true
            let value = "", c = null
            for (let i = 0; i < this.EditComponents.length; i++) {
                c = this.EditComponents[i]
                value = c.GetValue()
                if (c.Validate(value) === false) {
                    blValidate = false
                    break
                }
                if (!Common.IsNullOrEmpty(value)) {
                    data[c.Property.Name] = value
                }
                else if (this.IsUpdate && !c.IsPassword) {
                    data[c.Property.Name] = null
                }
            }
            if (!blValidate) return false

            if (this.Entity.ExpandSetEditData) data = this.Entity.ExpandSetEditData.call(this, data, this.IsUpdate, ns)
            if (data === false) return false

            if (this.IsUpdate && !this.IsLocalData && this.CompareValueEquals(data)) return false

            return data
        }

        CompareValueEquals(data) {
            if (!this.EntityData) return false;
            let blEquals = true
            for (let key in data) {
                if (key != this.Entity.PrimaryKey && key != "RowVersion" && !Common.IsEquals(this.EntityData[key], data[key])) {
                    blEquals = false
                    break
                }
            }
            if (blEquals) Common.Alert("对不起，您未对信息进行编辑！")
            return blEquals
        }

        ClearControlValue() {
            this.EditComponents.forEach((c) => c.SetValue(""))
        }

        GetDataGridComponent(name) {
            var list = this.EditComponents.filter(f => f.Property.Name === name)
            if (list.length === 0) return null
            return list[0].ControlList[1].DataGridComponent
        }
    }

})($ns);
((ns) => {
    const { Common, HtmlTag } = ns.utils
    const { ListPage } = ns.pages
    const { Search, GridView } = ns.layouts
    const { Buttons, PropertyItem, DataGrid, DataPaging } = ns.components
    const { SearchAction } = ns.actions

    ns.pages.DialogListPage = class DialogListPage extends ListPage {
        constructor(options) {
            options.PageName = "DialogListPage";
            options.IsDialog = true
            options.IsNewAdd = false
            options.IsExcelExport = false
            options.IsExcelImport = false
            options.IsEdit = false
            options.IsDelete2 = false
            options.IsDataRight = false
            options.IsDataStatus = false
            options.IsLookLog = false
            options.IsFixedWidth = true
            super(options)
        }

        PageLoad() {
            this.ListDialog = new ns.components.Dialog({
                Width: this.Width,
                Height: this.Height,
                Html: this.GetHtml(),
                Title: this.Title,
                IsOkButton: this.OkAction !== undefined,
                OkAction: this.OkAction
            })
            this.ListDialog.Show()

            this.EventLoad()
            this.DataLoad()

            this.SearchActions && this.SearchActions[0].Invoke()
        }
    }

})($ns);
