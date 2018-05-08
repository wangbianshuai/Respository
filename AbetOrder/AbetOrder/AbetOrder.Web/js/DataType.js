if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}

//去掉空格
String.prototype.Trim = function () {
    if (this != undefined && this != null) {
        var text = this.replace(/(^\s*)|(\s*$)/g, "");
        return text.replace(/(^　*)|(　*$)/g, "");
    }
    else {
        return "";
    }
};

//格式化字体串中{0},{1}……
String.Format = function (str, array) {
    if (String.IsNullOrEmpty(str)) {
        return String.Empty;
    }
    if ($.isArray(array)) {
        for (var i = 0; i < array.length; i++) {
            array[i] = String.IsNullOrEmpty(array[i]) ? String.Empty : array[i].toString();
            str = str.replace("{" + i.toString() + "}", array[i]);
        }
    }
    return str;
};

String.Empty = "";

//判断其不为NULl或Empty值
String.IsNullOrEmpty = function (value) {
    if (value == null || value == undefined) {
        return true;
    }
    else {
        if (value.toString().Trim() != "") {
            return false;
        }
        else {
            return true;
        }
    }
};

//字符串转化成货币显示格式 
String.prototype.ToCurrency = function () {
    var floatValue = parseFloat(this);
    if (isNaN(floatValue)) {
        return this;
    }
    else {
        var flString = floatValue.toFixed(2);
        var r = /(\d+)(\d{3})/;
        while (r.test(flString)) {
            flString = flString.replace(r, "$1" + ',' + '$2');
        }
        return flString;
    }
};

//字符串去掉逗号
String.prototype.TrimComma = function () {
    if (String.IsNullOrEmpty(this)) {
        return this;
    }
    else {
        return this.replace(/,/g, "");
    }
};

//将对象转化成数组
Object.ToArray = function (obj) {
    if (obj == null) {
        return null;
    }
    if ($.isArray(obj)) {
        return obj;
    }
    return new Array(obj);
};

//以属性名和值获取相应对象列表信息
Object.GetObjectListByNameValue = function (objList, name, value) {
    if (objList == null) {
        return null;
    }
    var newObjList = [];
    $.each(objList, function (index, item) {
        for (var key in item) {
            if (item[key] != null && key.toLowerCase() == name.toLowerCase() && item[key].toString().toLowerCase() == value.toString().toLowerCase()) {
                newObjList.push(item);
                break;
            }
        }
    });
    return newObjList;
};

//以属性名获取相应对象列表信息
Object.GetObjectListByName = function (objList, name) {
    if (objList == null) {
        return null;
    }
    var newObjList = [];
    $.each(objList, function (index, item) {
        for (var key in item) {
            if (key.toLowerCase() == name.toLowerCase()) {
                newObjList.push(item);
                break;
            }
        }
    });
    return newObjList;
};

//以属性名获取对象值
Object.GetObjectByName = function (obj, Name) {
    if (obj == null) {
        return null;
    }
    var newObj = null;
    for (var key in obj) {
        if (key.toLowerCase() == Name.toLowerCase()) {
            newObj = obj[key];
            break;
        }
    }
    return newObj;
};

Object.IsObject = function (obj) {
    if (obj == null || obj == undefined) {
        return false;
    }
    return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
};

//以属性名和值获取对象值，不存在反回为null
Object.GetObjectByNameValue = function (obj, name, value) {
    if (obj == null) {
        return null;
    }
    var newObj = null;
    for (var key in obj) {
        if (item[key] != null && key.toLowerCase() == name.toLowerCase() && item[key].toString().toLowerCase() == value.toString().toLowerCase()) {
            newObj = obj;
            break;
        }
    }
    return newObj;
};

//获取对象中值为Bool值
Object.GetBoolValue = function (obj, name, defaluValue) {
    var bool = Object.GetObjectByName(obj, name);
    if (bool == null) {
        bool = defaluValue;
    }
    else if (bool.toString().toLowerCase() == "true") {
        bool = true;
    }
    else {
        bool = false;
    }
    return bool;
};

//获取对象中值为String值
Object.GetStringValue = function (obj, name) {
    var str = Object.GetObjectByName(obj, name);
    if (String.IsNullOrEmpty(str)) {
        return "";
    }
    else {
        return str.toString();
    }
};

//获取对象中值为Int值
Object.GetIntValue = function (obj, name) {
    var i = Object.GetObjectByName(obj, name);
    if (i == null) {
        return 0;
    }
    else {
        i = parseInt(i);
        return isNaN(i) ? 0 : i;
    }
};

//获取对象中值为Float值
Object.GetFloatValue = function (obj, name) {
    var f = Object.GetObjectByName(obj, name);
    if (f == null) {
        return 0;
    }
    else {
        f = parseFloat(f);
        return isNaN(f) ? 0 : f;
    }
};

Object.CopyData = function (a, b) {
    if (a != null && b != null) {
        var e;
        for (var c in a) {
            e = null;
            for (var d in b) {
                if (c.toLowerCase() == d.toLowerCase()) {
                    e = d;
                    break;
                }
            }
            if (e != null) {
                if (typeof (b[e]) == "string") {
                    b[e] = String.IsNullOrEmpty(a[c]) ? String() : a[c].toString();
                }
                else if (typeof (b[e]) == "number") {
                    b[e] = isNaN(parseFloat(a[c])) ? 0 : parseFloat(a[c]);
                }
                else if (typeof (b[e]) == "boolean") {
                    b[e] = String.IsNullOrEmpty(a[c]) ? false : a[c].toString().toLowerCase() == "true" ? true : false;
                }
                else {
                    b[e] = a[c];
                }
            }
        }
    }
};

Object.Copy = function (a, b) {
    var d = null;
    if (a != null && b != null) {
        for (var c in b) {
            if ($.isArray(b[c])) {
                a[c] = [];
                for (var i = 0; i < b[c].length; i++) {
                    d = {};
                    Object.Copy(d, b[c][i]);
                    a[c].push(d);
                }
            }
            else if (Object.IsObject(b[c])) {
                a[c] = {};
                Object.Copy(a[c], b[c]);
            }
            else {
                a[c] = b[c];
            }
        }
    }
};

Object.Clone = function (obj) {
    var cloneObj = {};
    for (var key in obj) {
        if ($.isArray(obj[key])) {
            var dataList = [], data = null;
            for (var i = 0; i < obj[key].length; i++) {
                data = Object.Clone(obj[key][i]);
                dataList.push(data);
            }
            cloneObj[key] = dataList;
        }
        else if (Object.IsObject(obj[key])) {
            cloneObj[key] = Object.Clone(obj[key]);
        }
        else {
            cloneObj[key] = obj[key];
        }
    }
    return cloneObj;
};

//判断输入文本框是否是Decimal类型数值
Number.IsDecimal = function (value) {
    var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d+)?$");
    return reg.test(value);
};

//判断输入文本框是否是输入一位小数的浮点数
Number.IsDecimal1 = function (value) {
    var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$");
    return reg.test(value);
};

//判断输入文本框是否是输入两位小数的浮点数
Number.IsDecimal2 = function (value) {
    var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$|^(-?\\d+)(\\.\\d{2})?$");
    return reg.test(value);
};

//判断输入文本框是否是输入三位小数的浮点数
Number.IsDecimal3 = function (value) {
    var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$|^(-?\\d+)(\\.\\d{2})?$|^(-?\\d+)(\\.\\d{3})?$");
    return reg.test(value);
};

//判断输入文本框是否是输入四位小数的浮点数
Number.IsDecimal4 = function (value) {
    var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$|^(-?\\d+)(\\.\\d{2})?$|^(-?\\d+)(\\.\\d{3})?$|^(-?\\d+)(\\.\\d{4})?$");
    return reg.test(value);
};

//判断只能输入数字、小数点、负数(-)
Number.IsDecimalCharCode = function (e) {
    var key = window.event ? e.keyCode : e.which;
    var keychar = String.fromCharCode(key);
    var reg = new RegExp("\\d|\\.|\\-");
    return reg.test(keychar);
};

//判断只能输入数字
Number.IsNumberCharCode = function (e) {
    var key = window.event ? e.keyCode : e.which;
    var keychar = String.fromCharCode(key);
    var reg = new RegExp("\\d|\\-");
    return reg.test(keychar);
};

//判断只能输入自然数
Number.IsNaturalNumberCharCode = function (e) {
    var key = window.event ? e.keyCode : e.which;
    var keychar = String.fromCharCode(key);
    var reg = new RegExp("\\d");
    return reg.test(keychar);
};

//判断输入文本框是否是整数
Number.IsNumber = function (value) {
    var reg = new RegExp("^-?\\d+$");
    return reg.test(value);
};

Number.GetNumberValue = function (value) {
    if (String.IsNullOrEmpty(value)) {
        return 0;
    }
    value = value.toString().TrimComma();
    value = value.replace(/M/g, "");
    var newValue = parseFloat(value);
    if (!isNaN(newValue)) {
        return newValue;
    }
    if ($(value) != undefined && !String.IsNullOrEmpty($(value).text())) {
        newValue = parseFloat($(value).text());
        if (!isNaN(newValue)) {
            return newValue;
        }
    }
    else if ($(value) != undefined && !String.IsNullOrEmpty($(value).val())) {
        newValue = parseFloat($(value).val());
        if (!isNaN(newValue)) {
            return newValue;
        }
    }
    return 0;
};

//两数值相加
Number.Addition = function (num1, num2) {
    return Number.GetNumberValue(num1) + Number.GetNumberValue(num2);
};

//两数值相减
Number.SubTract = function (num1, num2) {
    return Number.GetNumberValue(num1) - Number.GetNumberValue(num2);
};

//两数值相乘
Number.Mutiply = function (num1, num2, scale) {
    if (scale == undefined) {
        return Number.GetNumberValue(num1) * Number.GetNumberValue(num2);
    }
    else {
        return parseFloat((Number.GetNumberValue(num1) * Number.GetNumberValue(num2)).toFixed(scale));
    }
};

//两数值相除
Number.Deduct = function (num1, num2, scale) {
    if (num2 != 0) {
        if (scale == undefined) {
            return Number.GetNumberValue(num1) / Number.GetNumberValue(num2);
        }
        else {
            return parseFloat((Number.GetNumberValue(num1) / Number.GetNumberValue(num2)).toFixed(scale));
        }
    }
    return 0;
};

//求和
Number.SumValue = function (dataList, name, scale) {
    var sum = 0;
    $.each(dataList, function (index, item) {
        sum += Number.GetNumberValue(item[name]);
    });
    if (scale != undefined) {
        sum = parseFloat(sum.toFixed(scale));
    }
    return sum;
};

//获取当前时间
Date.GetCurrentDate = function () {
    var myDate = new Date();
    return Date.GetDateString(myDate);
};

Date.GetCurrentYear = function () {
    return new Date().getFullYear();
};

Date.GetCurrentMonth = function () {
    return new Date().getMonth() + 1;
};

Date.GetCurrentWeek = function () {
    var d = new Date();
    var year = d.getFullYear();
    var firstDay = new Date(year, 0, 1);
    var firstWeekDays = 7 - firstDay.getDay();
    var dayOfYear = (((new Date(year, d.getMonth(), d.getDate())) - firstDay) / 86400000) + 1;
    return Math.ceil((dayOfYear - firstWeekDays) / 7) + 1;
};

Date.GetCurrentDateNumber = function () {
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
};

Date.ConvertToDate = function (dateString, format) {
    var year, month, day, hh, mm, ss, timeFormat, time, newDate;
    if (format != undefined) {
        if (format.substring(0, 10) == "yyyy-MM-dd" || format.substring(0, 10) == "yyyy/MM/dd") {
            var s5 = dateString.substring(4, 5), s7 = dateString.substring(7, 8);
            var bl = s5 == "-" || s5 == "/";
            bl = bl ? s7 == "-" || s7 == "/" : bl;
            if (!bl) {
                return NaN;
            }
            year = dateString.substring(0, 4);
            month = dateString.substring(5, 7);
            day = dateString.substring(8, 10);
            newDate = month + "-" + day + "-" + year;
            timeFormat = format.substring(10, format.length).Trim();
            time = dateString.substring(10, dateString.length).Trim();
        }
        if (format.substring(0, 10) == "MM-dd-yyyy" || format.substring(0, 10) == "MM/dd/yyyy") {
            var s2 = dateString.substring(2, 3), s4 = dateString.substring(4, 5);
            var bl = s2 == "-" || s2 == "/";
            bl = bl ? s4 == "-" || s4 == "/" : bl;
            if (!bl) {
                return NaN;
            }
            year = dateString.substring(6, 10);
            month = dateString.substring(0, 2);
            day = dateString.substring(3, 5);
            newDate = month + "-" + day + "-" + year;
            timeFormat = format.substring(10, format.length).Trim();
            time = dateString.substring(10, dateString.length).Trim();
        }
        if (format.substring(0, 8) == "yyyyMMdd") {
            year = dateString.substring(0, 4);
            month = dateString.substring(4, 6);
            day = dateString.substring(6, 8);
            newDate = month + "-" + day + "-" + year;
            timeFormat = format.substring(8, format.length).Trim();
            time = dateString.substring(8, dateString.length).Trim();
        }
        if (format.substring(0, 8) == "MMddyyyy") {
            year = dateString.substring(4, 8);
            month = dateString.substring(0, 2);
            day = dateString.substring(2, 4);
            newDate = month + "-" + day + "-" + year;
            timeFormat = format.substring(8, format.length).Trim();
            time = dateString.substring(8, dateString.length).Trim();
        }
        if (!String.IsNullOrEmpty(time) && !String.IsNullOrEmpty(timeFormat)) {
            if (!String.IsNullOrEmpty(timeFormat) && timeFormat == "HH:mm:ss") {
                hh = time.substring(0, 2);
                mm = time.substring(3, 5);
                ss = time.substring(6, 8);
                newDate += " " + hh + ":" + mm + ":" + ss;
            }
            else if (!String.IsNullOrEmpty(timeFormat) && timeFormat == "HHmmss") {
                hh = time.substring(0, 2);
                mm = time.substring(2, 4);
                ss = time.substring(4, 6);
                newDate += " " + hh + ":" + mm + ":" + ss;
            }
        }
        if (!String.IsNullOrEmpty(newDate)) {
            dateString = newDate;
        }
    }
    //判断是否是火狐浏览器
    if (Common.IsFirefox()) {
        if (!String.IsNullOrEmpty(newDate)) {
            if (!String.IsNullOrEmpty(time) && !String.IsNullOrEmpty(timeFormat)) {
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
};


Date.ConvertJsonDate = function (jsonDateString) {
    if (String.IsNullOrEmpty(jsonDateString)) {
        return String.Empty;
    }
    jsonDateString = jsonDateString.replace("/Date(", "").replace(")/", "");
    jsonDateString = jsonDateString.substring(0, 13);
    var milliseconds = Number(jsonDateString);
    var date = new Date(milliseconds);
    return date;
};

Date.ConvertJsonDateString = function (jsonDateString) {
    if (String.IsNullOrEmpty(jsonDateString)) {
        return String.Empty;
    }
    if (jsonDateString.Trim().indexOf("/Date(") == 0 && jsonDateString.Trim().indexOf(")/" > 0)) {
        jsonDateString = jsonDateString.replace("/Date(", "").replace(")/", "");
        jsonDateString = jsonDateString.substring(0, 13);
        var milliseconds = Number(jsonDateString);
        var date = new Date(milliseconds);
        return Date.GetDateString(date);
    }
    else {
        return jsonDateString.replace(/\//g, "-");
    }
};

Date.GetDateString = function (myDate, isDate) {
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
};

Date.GetDateStringByMilliSeconds = function (myDate, isDate) {
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
};

Date.ConvertToJsonDate = function (date) {
    var dateString = date.getTime().toString();
    return "\/Date(" + dateString + ")\/";
};

//获取昨天
Date.GetYestoday = function (date) {
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
};

//获得上个月在这一天的日期
Date.GetLastMonthYestoday = function (date) {
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var strYear = date.getFullYear();
    var strDay = date.getDate();
    var strMonth = date.getMonth() + 1;
    if (strYear % 4 == 0 && strYear % 100 != 0) {
        daysInMonth[1] = 29;
    }
    if (strMonth - 1 == 0) {
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
};

function Guid() { }

Guid.Empty = "00000000-0000-0000-0000-000000000000";

Guid.NewGuid = function () {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) {
            guid += "-";
        }
    }
    return guid.toLowerCase();
};