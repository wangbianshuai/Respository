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

    static BindEvent(ele, eventName, fn) {
        Common.RemoveEvent(ele, eventName, fn)
        Common.AddEvent(ele, eventName, fn)
    }

    static AddEvent(ele, eventName, fn) {
        if (ele.attachEvent) {
            ele.attachEvent('on' + eventName, fn)
        }
        else if (ele.addEventListener) {
            ele.addEventListener(eventName, fn, false)
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
}

