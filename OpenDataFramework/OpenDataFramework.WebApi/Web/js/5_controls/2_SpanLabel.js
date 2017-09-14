((ns) => {
    const { Index } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.SpanLabel = class SpanLabel extends Index {
        constructor(options) {
            super(options)

            if (this.LabelWidth) this.Width = this.LabelWidth
            this.Width = this.Width || 100

            Common.InitValue(this, ["IsColon", "IsWidth"], true)
        }

        GetHtml() {
            if (!this.Label || this.ControlType === "CheckBox" || this.ControlType === "GridView" || this.ControlType === "Button") {
                this.Width = 0
                return ""
            }

            const colon = this.IsColon ? "：" : ""

            let styleList = []
            if (this.IsWidth) styleList.push(`width:${this.Width}px;`)
            let style = this.GetStyle(styleList)

            let className = this.GetClass()

            let label = Common.ReplaceHtmlTag(this.Label);
            return `<span id="${this.Id}"${style}${className}>${label}${colon}</span>`
        }

        SetValue(value) {
            HtmlTag.SetHtml(this.Element, value)
        }
    }

    ns.controls.SpanText = class SpanText extends Index {
        constructor(options) {
            super(options)
        }

        GetHtml() {
            let styleList = []
            if (this.IsWidth) styleList.push(`width:${this.Width}px;`)
            let style = this.GetStyle(styleList)

            let className = this.GetClass()

            let v = this.Value || this.DefaultValue;
            v = Common.ReplaceHtmlTag(v);
            return `<span id="${this.Id}"${style}${className}>${v}</span>`
        }

        SetValue(value) {
            HtmlTag.SetHtml(this.Element, value)
        }
    }

    ns.controls.DataSpan = class DataSpan extends Index {
        constructor(options) {
            super(options)
        }

        GetHtml() {
            this.Value = Common.IsNullOrEmpty(this.Value) ? "" : this.Value
            const { DataType } = this;
            this.IsNumberType = DataType === "int" || DataType === "long" || DataType === "float" || DataType === "money";
            this.SetFormatStyle();

            if (!this.IsLabel) this.SetValue()
            let colorStyle = this.GetColorStyle()
            this.SetCurrencyValue();

            let v = Common.ReplaceHtmlTag(this.Value);
            return `<span id="${this.Id}" style="padding:1px 2px 1px 2px;${colorStyle}">${v}</span>`
        }

        SetFormatStyle() {
            switch (this.DataFormat) {
                case "日期": {
                    if (this.Value) this.Value = this.Value.substring(0, 10);
                    break;
                }
                case "货币": {
                    this.IsCurrency = true; break;
                }
            }

            if (!this.TextAlign) {
                if (this.IsNumberType || this.DataType === "date") this.TextAlign = "right";
            }
        }

        SetCurrencyValue() {
            if (!this.IsCurrency && this.DataType === "money") this.IsCurrency = true;
            if (this.IsCurrency) this.Value = Common.ToCurrency(this.Value)
            else if (this.IsNumberType && this.Scale > 0) this.Value = Common.GetNumberValue(this.Value).toFixed(this.Scale);
        }

        GetColorStyle() {
            if (this.Value && this.IsNumberType) {
                var nv = Common.GetNumberValue(this.Value);
                if (nv < 0) return " color:red;"
            }

            return ""
        }

        SetValue() {
            if (this.Options && this.Options.length > 0) {
                this.SetValueText(this.Options, "Value", "Text");
            }
            else if (this.DataList && this.DataList.length > 0) {
                this.SetValueText(this.DataList, this.ValueName, this.TextName);
            }

            if (this.ControlType === "CheckBox") {
                this.CheckedText = this.CheckedText === undefined ? "是" : this.CheckedText
                this.UnCheckedText = this.UnCheckedText === undefined ? "否" : this.UnCheckedText
                let checkedValue = this.CheckedValue === undefined ? "true" : this.CheckedValue
                this.Value = Common.IsEquals(this.Value, checkedValue, true) ? this.CheckedText : this.UnCheckedText
            }
        }

        SetValueText(dataList, valueName, textName, blSet) {
            let list = dataList.filter(f => f[valueName] !== undefined && Common.IsEquals(f[valueName], this.Value))
            if (list.length > 0) {
                this.Value = list[0][textName]
                blSet && HtmlTag.SetHtml(this.Element, Common.ReplaceHtmlTag(this.Value));
            }
        }

        DataLoad2() {
            if (!this.DataList && this.DataSource) {
                this.GetDataList().then(() => this.SetValueText(this.DataList, this.ValueName, this.TextName, true))
            }
        }
    }

    ns.controls.DataCheckBox = class DataCheckBox extends Index {
        constructor(options) {
            super(options)

            this.ColumnWidth = 20;
            this.TextAlign = "center";
        }

        GetHtml() {
            return this.GetInputHtml("checkbox")
        }

        GetChecked() { return this.Element.checked }

        SetChecked(checked) {
            if (checked === undefined) {
                window.setTimeout(() => {
                    if (!this.IsChangeEvent) {
                        if (this.Element.checked) this.Element.checked = false;
                        else this.Element.checked = true;
                        this.CheckChanged && this.CheckChanged(this.Element.checked)
                    }
                    else {
                        this.IsChangeEvent = false
                    }
                }, 50)
            }
            else this.Element.checked = checked
        }

        EventLoad2() {
            HtmlTag.BindEvent(this.Element, "change", (e) => this.Changed(e))
        }

        Changed(e) {
            this.IsChangeEvent = true
            this.CheckChanged && this.CheckChanged(this.Element.checked)
        }
    }

})($ns);