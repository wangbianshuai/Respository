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