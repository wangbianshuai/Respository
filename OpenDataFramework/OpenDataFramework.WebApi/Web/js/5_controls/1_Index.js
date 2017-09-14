((ns) => {
    const { Common, HtmlTag } = ns.utils

    ns.controls.Index = class Index {
        constructor(options) {
            this.Id = Common.CreateGuid()
            this.Attributes = []

            options && Object.assign(this, options)

            this.Height = this.Height || 30
        }

        GetHtml() { return "" }
        EventLoad2() { }
        DataLoad2() { }

        EventLoad() {
            this.Element = HtmlTag.GetById(this.Id)
            this.EventLoad2()
        }

        GetRowClassName() { return "" }

        DataLoad() {
            this.DataLoad2();
        }

        GetAttributeHtml() {
            return this.Attributes.map((a) => this.GetAttributeItem(a)).join("")
        }

        GetAttributeItem(a) {
            return ` ${a.Name}="${a.Value}"`
        }

        SetAttribute(name, value) {
            this.Attributes.push({ Name: name, Value: value })
        }

        GetInputHtml(type) {
            let html = []

            html.push(`<input id="${this.Id}" type="${type}"`)

            html.push(this.GetAttributeHtml())

            html.push("/>")

            return html.join("")
        }

        GetValue() {
            if (this.ControlType === "CheckBox") {
                return this.GetCheckBoxValue()
            }
            let value = HtmlTag.GetValue(this.Element)
            this.Value = Common.IsNullOrEmpty(value) ? "" : Common.Trim(value)
            return this.Value;
        }

        SetValue(value) {
            if (this.ControlType === "CheckBox") {
                this.SetCheckBoxValue(value)
                return
            }
            value = value === undefined ? "" : value
            this.Value = value;
            HtmlTag.SetValue(this.Element, value)
        }

        SetDisabled(disabled) {
            HtmlTag.SetDisabled(this.Element, disabled)
        }

        GetDisabled() {
            return HtmlTag.GetDisabled(this.Element)
        }

        GetStyle(styleList) {
            return styleList.length === 0 ? "" : " style=\"" + styleList.join("") + "\""
        }

        GetClass() {
            return this.ClassName ? " class=" + this.ClassName : ""
        }

        GetDataList() {
            return ns.data.Cache.GetPropertyDataList(this)
        }

        GetMaxLength() {
            switch (this.DataType) {
                case "int": return 10
                case "float":
                case "money":
                case "long": return 20
                default: return 0
            }
        }

        GetScale() {
            switch (this.DataType) {
                case "int":
                case "long": 0
                case "float":
                case "money": return 2
                default: return 0
            }
        }
    }

})($ns);