export function GetProperty(Name, Label, DataType, IsNullable, MaxLength, Scale) {
    DataType = DataType || "string";
    IsNullable = IsNullable === undefined ? true : IsNullable;
    MaxLength = MaxLength || 50;
    Scale = Scale || 2
    return { Name, Label, DataType, IsNullable, MaxLength, Scale }
}

export function GetButton(Name, Text, ButtonType, X, Y) {
    return { Name, Text, Type: "Button", ButtonType, X, Y }
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
        else p2 = p;
        if (p2 !== null) {
            p2.X = p2.X || i + 1;
            p2.Y = p2.Y || 1;
            p2.RowId = CreateGuid();
            p2.ColId = CreateGuid();
            p2.Id = CreateGuid();
            p2.IsNullable = p2.IsNullable === undefined ? true : p2.IsNullable
            pList.push(p2);
        }
    });

    return pList;
}

export function GetEntityProperty(entity, name) {
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