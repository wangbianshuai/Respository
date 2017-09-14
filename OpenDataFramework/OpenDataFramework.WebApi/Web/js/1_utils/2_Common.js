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
    }

    Object.assign = Object.assign || Common.Assign

})($ns);