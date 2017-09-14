((ns) => {
    const { Index } = ns.components
    const { SpanLabel, SpanText, TextBox, GridView, DownList, TextArea, TextSelect, Button } = ns.controls
    const { Common } = ns.utils

    ns.components.PropertyItem = class PropertyItem extends Index {
        constructor(options) {
            super(options)

            this.InitControls()

            this.IsPassword = this.Property.ControlType === "Password"
        }

        InitControls() {
            let p = this.Property
            if (!p.Action && p.ActionInvoke) { p.Action = new ns.actions.Index(this); p.Action.Invoke = p.ActionInvoke }

            this.ControlList = []
            this.ControlList.push(new SpanLabel(this.Property))
            this.ControlList.push(this.GetControl())
        }

        GetControl() {
            switch (this.Property.ControlType) {
                case "GridView": return new GridView(this.Property)
                case "DownList": return new DownList(this.Property)
                case "TextArea": return new TextArea(this.Property)
                case "Button": return new Button(this.Property)
                case "SpanText": return new SpanText(this.Property)
                case "TextSelect": return new TextSelect(Object.assign({ EnterControl: this.EnterControl }, this.Property))
                default: return new TextBox(Object.assign({ EnterControl: this.EnterControl }, this.Property))
            }
        }

        GetRowClassName() {
            return this.ControlList[1].GetRowClassName()
        }

        GetHtml() {
            let html = []
            let c = null
            let width = 0, height = 0

            !this.IsTd && html.push("<dl>")

            c = this.ControlList[0]
            if (this.IsTd) {
                html.push("<td style=\"text-align:right;\">" + c.GetHtml() + "</td>")
            }
            else {
                html.push("<dt>" + c.GetHtml() + "</dt>")
            }
            width += c.Width
            height = c.Height

            c = this.ControlList[1]
            if (this.IsTd) {
                html.push("<td style=\"text-align:left;\">" + c.GetHtml() + "</td>")
            }
            else {
                html.push("<dd>" + c.GetHtml() + "</dd>")
            }
            width += c.Width + 10
            height = c.Height > height ? c.Height : height

            this.Width = width
            this.Height = height

            !this.IsTd && html.push("</dl>")

            return html.join("")
        }

        GetValue() {
            return this.ControlList[1].GetValue()
        }

        Validate(value, blNull) {
            blNull = blNull === undefined ? true : blNull;
            const { IsNullable, Label, MaxLength, DataType } = this.Property
            let message = "", blSucceed = true

            if (IsNullable === false && Common.IsNullOrEmpty(value) && blNull) {
                message = Label + "不能为空！"
                blSucceed = false
            }

            if (blSucceed && MaxLength > 0 && value && value.length > MaxLength) {
                message = Label + "字符长度超过" + MaxLength + "个！"
                blSucceed = false
            }

            var isNumberType = DataType === "int" || DataType === "long" || DataType === "float" || DataType === "money";
            let c1 = this.ControlList[1];

            if (blSucceed && isNumberType && c1.ValidateNumber) {
                message = c1.ValidateNumber(value);
                if (message) blSucceed = false
            }

            if (blSucceed && DataType === "date" && c1.ValidateDate) {
                message = c1.ValidateDate(value);
                if (message) blSucceed = false
            }

            if (!blSucceed) Common.Alert(message)
            return blSucceed
        }

        SetValue(value) {
            this.ControlList[1].SetValue(value)
        }
    }

})($ns);