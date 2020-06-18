function GetProperty(Name, Label, DataType, IsNullable, MaxLength, Scale) {
    DataType = DataType || "string";
    IsNullable = IsNullable === undefined ? true : IsNullable;
    MaxLength = MaxLength || 50;
    Scale = Scale || 2
    return { Name, Label, DataType, IsNullable, MaxLength, Scale }
}

function GetButton(Name, Text, ButtonType, X, Y) {
    return { Name, Text, Type: "Button", ButtonType, X, Y, IsDisabled: true }
}

var guidId = 100000000;
var Guids = {};
var guidIndex = 1;

function CreateGuid(name) {
    if (name) {
        if (!Guids[name]) { guidIndex += 1; Guids[name] = guidIndex * 100000000; }
        var id = Guids[name];
        id += 1;
        Guids[name] = id;
        return id.toString();
    }
    else {
        guidId += 1;
        return guidId.toString();
    }
}

function AssignProporties(entity, list) {
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
            p2.RowId = CreateGuid(entity.Name);
            p2.ColId = CreateGuid(entity.Name);
            p2.Id = CreateGuid(entity.Name);
            p2.IsNullable = p2.IsNullable === undefined ? true : p2.IsNullable
            if (p2.DataType === "float" && !p2.Scale) p2.Scale = 2;
            pList.push(p2);
        }
    });

    return pList;
}

function IsObject(obj) {
    if (obj === null || obj === undefined) return false
    return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length
}

function IsEmptyObject(obj) {
    if (!IsObject(obj)) return true

    if (Object.getOwnPropertyNames(obj).length > 0) return false

    let blEmpty = true
    for (let key in obj) if (key) { blEmpty = false; break; }

    return blEmpty
}

function GetEntityProperty(entity, name) {
    if (IsEmptyObject(entity) || !entity.Properties) return null;
    const list = entity.Properties.filter(f => f.Name === name);
    if (list && list.length === 1) return Object.assign({}, list[0]);
    return null;
}

function GetRadio(Name, Label, DataSource, X, Y, DefaultValue, ButtonWidth) {
    return { Name, Label, Type: "Radio", DataSource, X, Y, IsButton: true, DefaultValue, ButtonWidth }
}

function GetTextBox(Name, Label, ControlType, X, Y, PlaceHolder, MaxLength) {
    return { Name, Label, Type: "TextBox", ControlType, PlaceHolder, X, Y, MaxLength }
}

function GetRowTextBox(Name, Label, Span, PlaceHolder, MaxLength, IsNullable, IsEdit) {
    return { Name, Label, Type: "TextBox", Span, PlaceHolder, MaxLength, IsNullable, IsEdit };
}

function GetRowSelect(Name, Label, Span, DataSource, DefaultValue, IsNullable, IsEdit) {
    return { Name, Label, Type: "Select", Span, DataSource, DefaultValue, IsNullable, IsEdit }
}

function GetRowSelect2(Name, Label, Span, ServiceDataSource, DefaultValue, IsNullable, IsEdit) {
    return { Name, Label, Type: "Select", Span, ServiceDataSource, DefaultValue, IsNullable, IsEdit }
}

function GetSelect(Name, Label, DataSource, X, Y, DefaultValue) {
    return { Name, Label, Type: "Select", DataSource, X, Y, DefaultValue }
}

function GetSelect2(Name, Label, ServiceDataSource, X, Y, DefaultValue) {
    return { Name, Label, Type: "Select", ServiceDataSource, X, Y, DefaultValue }
}

function GetAutoComplete(Name, Label, ServiceDataSource, X, Y, DefaultValue) {
    return { Name, Label, Type: "AutoComplete", ServiceDataSource, X, Y, DefaultValue }
}


function GetDatePicker(Name, Label, X, Y, DefaultValue) {
    return { Name, Label, Type: "DatePicker", X, Y, DefaultValue }
}

const RegExpress = {};

//非数字与字母,用于替换
RegExpress.NoNumberChar = "[^0-9a-zA-Z]";

//只能输入数字与字母，用于键盘输入keypress
RegExpress.InputNumberChar = "^[0-9a-zA-Z]+$";

//非数字,用户于替换
RegExpress.NoNumber = "[^\\d]";

//只能输入数字，用于键盘输入keypress
RegExpress.InputNumber = "^[\\d]+$";

module.exports = {
    GetAutoComplete,
    GetButton,
    GetDatePicker,
    GetEntityProperty,
    GetProperty,
    GetRadio,
    GetSelect,
    GetSelect2,
    GetTextBox,
    AssignProporties,
    RegExpress,
    IsObject,
    IsEmptyObject,
    CreateGuid,
    GetRowSelect,
    GetRowSelect2,
    GetRowTextBox
}