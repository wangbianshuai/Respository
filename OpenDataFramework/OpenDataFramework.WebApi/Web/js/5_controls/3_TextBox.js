((ns) => {
    const { Index } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.TextBox = class TextBox extends Index {
        constructor(options) {
            super(options)

            if (this.ControlWidth) this.Width = this.ControlWidth
            this.Width = this.Width || 200
        }

        GetHtml() {
            this.SetDataType();
            this.SetAttribute("name", this.Name)
            this.MaxLength > 0 && this.SetAttribute("maxlength", this.MaxLength)
            this.IsInput() && this.SetAttribute("autocomplete", "off")
            this.ClassName && this.SetAttribute("class", this.ClassName)
            this.PlaceHolder && this.SetAttribute("placeholder", this.PlaceHolder)
            this.Checked && this.SetAttribute("checked", "checked")
            this.DefaultValue && this.SetAttribute("value", this.DefaultValue)

            let styleList = []
            this.IsInput() && styleList.push(`width:${this.Width}px;`)
            styleList.length > 0 && this.SetAttribute("style", styleList.join(""))

            switch (this.ControlType) {
                case "Password": return this.GetInputHtml("password")
                case "CheckBox": return this.GetCheckBoxHtml(this.GetInputHtml("checkbox"))
                case "TextDate": return this.GetInputHtml("date")
                default: return this.GetInputHtml("text")
            }
        }

        GetCheckBoxHtml(html) {
            let label = this.Label.replace("是否", "")
            return "<div class=\"DivCheckBox\" style=\"margin-left:" + (this.LabelWidth + 5) + "px;\"><label>" + html + "<span>" + label + "</span></label></div>"
        }

        GetCheckBoxValue() {
            let checkedValue = this.CheckedValue !== undefined ? this.CheckedValue : "true"
            let unCheckedValue = this.UnCheckedValue !== undefined ? this.UnCheckedValue : "false"
            return this.Element.checked ? checkedValue : unCheckedValue
        }

        SetCheckBoxValue(value) {
            let v = Common.IsNullOrEmpty(value) ? "" : value.toString().toLowerCase()
            let checkedValue = this.CheckedValue !== undefined ? this.CheckedValue : "true"
            this.Element.checked = v === checkedValue.toString().toLowerCase()
        }

        IsInput() {
            return this.ControlType !== "CheckBox" && this.ControlType !== "Radio"
        }

        EventLoad3() { }
        DataLoad3() { }

        EventLoad2() {
            this.IsKeyPress = false;
            this.IsBlur = false;
            if (this.EnterControl) this.IsKeyPress = true;
            else if (this.ControlType === "TextBox" && this.IsNumberType) {
                this.IsBlur = true;
                this.IsKeyPress = true;
            }

            if (this.IsKeyPress) HtmlTag.BindEvent(this.Element, "keypress", (e) => this.KeypressEvent(e))
            if (this.IsBlur) HtmlTag.BindEvent(this.Element, "blur", (e) => this.BlurEvent(e))

            this.EventLoad3()
        }

        SetDataType() {
            const { DataType } = this;
            this.IsNumberType = DataType === "int" || DataType === "long" || DataType === "float" || DataType === "money";
            if (!this.MaxLength) {
                var maxLength = this.GetMaxLength();
                if (maxLength > 0) this.MaxLength = maxLength;
            }
            if (!this.Scale) this.Scale = this.GetScale()
        }

        DataLoad2() {
            this.DataLoad3()
        }

        KeypressEvent(e) {
            var key = window.event ? e.keyCode : e.which;
            var dataType = this.DataType === "int" || this.DataType === "long" ? "int" : "decimal";
            var blSucceed = true;

            if (key != 13 && key != 8 && key > 0) {
                if (dataType == "int") {
                    blSucceed = Common.IsNumberCharCode(e);
                }
                else if (dataType == "decimal") {
                    blSucceed = Common.IsDecimalCharCode(e);
                }
            }

            if (blSucceed && key == 13) {
                this.EnterControl && this.KeypressEnter(e);
            }

            return blSucceed;
        }

        BlurEvent(e) {
            var value = HtmlTag.GetValue(this.Element);

            var message = ""
            if (this.DataType === "date") message = ValidateDate(value)
            else if (this.IsNumberType) message = this.ValidateNumber(value);

            if (message) {
                Common.Alert(message);
                this.Element.focus();
                HtmlTag.SetValue(this.Element, "");
            }

            return !message;
        }

        ValidateDate(value) {
            if (Common.IsNullOrEmpty(value)) return "";

            var message = "";

            var blSucceed = true;
            if (value.length > 10) {
                blSucceed = false;
            }
            if (blSucceed) {
                var date = Common.ConvertToDate(value, "yyyy-MM-dd");
                if (isNaN(date)) date = Common.ConvertToDate(value, "yyyy/MM/dd");

                if (isNaN(date)) {
                    blSucceed = false;
                }
            }
            if (!blSucceed) message = "对不起，您输入的日期格式不正确！\n支持日期格式如下：2012-12-12";

            return message;
        }

        ValidateNumber(value) {
            var message = "";
            var dataType = this.DataType === "int" || this.DataType === "long" ? "int" : "decimal";
            var scale = this.Scale === undefined ? 0 : parseInt(this.Scale);

            if (!Common.IsNullOrEmpty(value)) {
                if (dataType == "int") {
                    message = this.JudgeNumber(value);
                }
                else if (dataType == "decimal") {
                    if (scale == 0) {
                        message = this.JudgeNumber(value);
                    }
                    else if (scale == 1) {
                        message = this.JudgeDecimal1(value);
                    }
                    else if (scale == 2) {
                        message = this.JudgeDecimal2(value);
                    }
                    else if (scale == 3) {
                        message = this.JudgeDecimal3(value);
                    }
                    else if (scale == 4) {
                        message = this.JudgeDecimal4(value);
                    }
                    else {
                        message = this.JudgeDecimal(value);
                    }
                }
            }

            return message;
        }

        KeypressEnter(e) {
            if (!this.EnterControl.Element) return
            this.EnterControl.Element.focus();
            this.EnterControl.Element.click();
        }

        JudgeDecimal(value) {
            return Common.IsDecimal(value) ? "" : "请输入一个数值！";
        }

        JudgeDecimal1(value) {
            return Common.IsDecimal1(value) ? "" : "请输入一个数值，最多只能有一位小数！";
        }

        JudgeDecimal2(value) {
            return Common.IsDecimal2(value) ? "" : "请输入一个数值，最多只能有两位小数！";
        }

        JudgeDecimal3(value) {
            return Common.IsDecimal3(value) ? "" : "请输入一个数值，最多只能有三位小数！";
        }

        JudgeDecimal4(value) {
            return Common.IsDecimal4(value) ? "" : "请输入一个数值，最多只能有四位小数！";
        }

        JudgeNumber(value) {
            return Common.IsNumber(value) ? "" : "请输入一个整数！";
        }
    }

})($ns);