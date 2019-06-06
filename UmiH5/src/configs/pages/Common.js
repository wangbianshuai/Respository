export function GetProperty(Name, Label, DataType, IsNullable, MaxLength, Scale) {
    DataType = DataType || "string";
    IsNullable = IsNullable === undefined ? true : IsNullable;
    MaxLength = MaxLength || 50;
    Scale = Scale || 2
    return { Name, Label, DataType, IsNullable, MaxLength, Scale }
}

export function GetButton(Name, Text, ButtonType, X, Y) {
    return { Name, Text, Type: "Button", ButtonType, X, Y, IsDisabled: true }
}

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

export function AssignProporties(entity, list) {
    const pList = [];

    let p2 = null;
    list.forEach((p, i) => {
        if (typeof p === "string") p2 = GetEntityProperty(entity, p);
        else {
            p2 = GetEntityProperty(entity, p.Name)
            if (p2 === null) p2 = p;
            else p2 = { ...p2, ...p };
        }
        if (p2 !== null) {
            p2.X = p2.X || i + 1;
            p2.Y = p2.Y || 1;
            p2.RowId = CreateGuid();
            p2.ColId = CreateGuid();
            p2.Id = CreateGuid();
            p2.IsNullable = p2.IsNullable === undefined ? true : p2.IsNullable
            if (p2.DataType === "float" && !p2.Scale) p2.Scale = 2;
            pList.push(p2);
        }
    });

    return pList;
}

export function IsObject(obj) {
    if (obj === null || obj === undefined) return false
    return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length
}

export function IsEmptyObject(obj) {
    if (!IsObject(obj)) return true

    if (Object.getOwnPropertyNames(obj).length > 0) return false

    let blEmpty = true
    for (let key in obj) if (key) { blEmpty = false; break; }

    return blEmpty
}

export function GetEntityProperty(entity, name) {
    if (IsEmptyObject(entity)) return null;
    const list = entity.Properties.filter(f => f.Name === name);
    if (list && list.length === 1) return Object.assign({}, list[0]);
    return null;
}

export function GetRadio(Name, Label, DataSource, X, Y, DefaultValue, ButtonWidth) {
    return { Name, Label, Type: "Radio", DataSource, X, Y, IsButton: true, DefaultValue, ButtonWidth }
}

export function GetTextBox(Name, Label, ControlType, X, Y, PlaceHolder, MaxLength) {
    return { Name, Label, Type: "TextBox", ControlType, PlaceHolder, X, Y, MaxLength }
}

export function GetSelect(Name, Label, DataSource, X, Y, DefaultValue) {
    return { Name, Label, Type: "Select", DataSource, X, Y, DefaultValue }
}

export function GetSelect2(Name, Label, ServiceDataSource, X, Y, DefaultValue) {
    return { Name, Label, Type: "Select", ServiceDataSource, X, Y, DefaultValue }
}

export function GetAutoComplete(Name, Label, ServiceDataSource, X, Y, DefaultValue) {
    return { Name, Label, Type: "AutoComplete", ServiceDataSource, X, Y, DefaultValue }
}


export function GetDatePicker(Name, Label, X, Y, DefaultValue) {
    return { Name, Label, Type: "DatePicker", X, Y, DefaultValue }
}

export const RegExpress = {};

//非数字与字母,用于替换
RegExpress.NoNumberChar = /[^0-9a-zA-Z]/g;

//只能输入数字与字母，用于键盘输入keypress
RegExpress.InputNumberChar = /^[0-9a-zA-Z]+$/;

//非数字,用户于替换
RegExpress.NoNumber = /[^\d]/g;

//只能输入数字，用于键盘输入keypress
RegExpress.InputNumber = /^[\d]+$/;