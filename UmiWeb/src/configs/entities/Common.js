export function GetProperty(Name, PropertyName, Label, DataType, IsNullable, MaxLength, Scale) {
    DataType = DataType || "string";
    IsNullable = IsNullable === undefined ? true : IsNullable;
    MaxLength = MaxLength || 50;
    Scale = Scale || 2
    return { Name, PropertyName, Label, DataType, IsNullable, MaxLength, Scale }
}

export function GetProperty2(Name, Label, DataType, IsNullable, MaxLength, Scale) {
    return GetProperty(Name, Name, Label, DataType, IsNullable, MaxLength, Scale)
}