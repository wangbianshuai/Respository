class Common {
    //创建GUID
    static CreateGuid() {
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

    //字符串转化成货币显示格式 
    static ToCurrency(value, blFixed2) {
        blFixed2 = blFixed2 === undefined ? true : blFixed2
        var floatValue = parseFloat(value)
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
                Common.RemoveEvent(ele, eventName, eventObj.EventAction)
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

            if (eventObj.EventList.length === 1) Common.AddEvent(ele, eventName, eventObj.EventAction);
        }
    }

    static OffBindEvent(ele, eventName) {
        Common.BindEvent(ele, eventName, null, true);
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

    static GetNumber(value, scale) {
        let f = parseFloat(value)
        if (isNaN(f)) return value

        scale = (scale || 2) * 10
        return Math.floor(f * scale) / scale
    }

    static IsArray(obj) {
        if (obj === null || obj === undefined) return false
        return typeof (obj) === "object" && obj.length >= 0
    }

    static IsObject(obj) {
        if (obj === null || obj === undefined) return false
        return typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length
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

if (!Object.assign) Object.assign = Common.Assign;
