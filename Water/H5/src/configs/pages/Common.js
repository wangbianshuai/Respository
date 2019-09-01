export function GetProperty(Name, Label, DataType, IsNullable, MaxLength, Scale) {
    DataType = DataType || "string";
    IsNullable = IsNullable === undefined ? true : IsNullable;
    MaxLength = MaxLength || 50;
    Scale = Scale || 2
    return { Name, Label, DataType, IsNullable, MaxLength, Scale }
}

export function GetButton(Name, Text, ButtonType) {
    return { Name, Text, Type: "Button", ButtonType }
}

export function GetImageProperty(Name, Label, dirName, isNullable, BidCode) {
    return { Name, Label, Type: "UploadImage", dirName, isNullable ,
        ErrorMessage : `请上传${Label}`,
        BidCode : BidCode || "COMPANY_AUTHENTICATION",
        ClassName : "step2-upload upload-back upload-file",
        IsRenderControl : true,
        IsImage2 : true,
		IsEdit:true,
    }
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
            p2.RowId = CreateGuid();
            p2.ColId = CreateGuid();
            p2.Id = CreateGuid();
            p2.IsNullable = p2.IsNullable === undefined ? true : p2.IsNullable
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

export function GetTextBox(Name, Label, ControlType, PlaceHolder, MaxLength) {
    return { Name, Label, Type: "TextBox", ControlType, PlaceHolder, MaxLength }
}

export function GetSelect(Name, Label, DataSource, DefaultValue) {
    return { Name, Label, Type: "Select", DataSource, DefaultValue }
}

export function GetSelect2(Name, Label, ServiceDataSource, DefaultValue) {
    return { Name, Label, Type: "Select", ServiceDataSource, DefaultValue }
}

export function GetDatePicker(Name, Label, DefaultValue) {
    return { Name, Label, Type: "DatePicker", DefaultValue }
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

export function ToRem(px) {
    return parseFloat((px * 1.0000) / 32).toFixed(4) + "rem";
}