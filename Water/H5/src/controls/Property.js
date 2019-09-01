import { Common } from "UtilsCommon";

export default class Property {
    constructor(name, label, type, isNullable, isReadonly) {
        this.Id = Common.CreateGuid();
        this.Name = name;
        this.Label = label;
        this.Type = type || "TextBox";
        this.IsNullable = isNullable === undefined ? true : isNullable;
        this.IsReadonly = isReadonly === undefined ? false : isReadonly;
    }

    static GetTextProperty(name, label, maxlength, isNullable, isReadonly) {
        const p = new Property(name, label, "TextBox", isNullable, isReadonly);
        p.MaxLength = maxlength;
        return p;
    }

    static GetInputNumber(name, label, isNullable) {
        const p = Property.GetTextProperty(name, label, 20, isNullable);
        p.ControlType = "InputNumber";
        return p;
    }

    static GetImageProperty(name, label, dirName, isNullable) {
        const p = new Property(name, label, "UploadImage", isNullable);
        p.BidCode = "COMPANY_AUTHENTICATION";
        p.ErrorMessage = `请上传${label}`;
        p.DirName = dirName
        return p;
    }
}