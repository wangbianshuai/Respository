((ns) => {
    const { Index } = ns.components
    const { DataSpan, LinkButton, LinkButtonList, DataCheckBox } = ns.controls
    const { HtmlTag } = ns.utils

    ns.components.DataItem = class DataItem extends Index {
        constructor(options) {
            super(options)

            this.BorderColor = this.BorderColor || "#a6c9e2"
            this.InitControls()
        }

        InitControls() {
            this.ControlList = []
            if (this.IsCheckBox) {
                this.CheckBoxControl = new DataCheckBox({ CheckChanged: (checked) => this.CheckChanged(checked) });
                this.ControlList.push(this.CheckBoxControl);
            }
            if (this.Data) {
                this.ControlList = this.ControlList.concat(this.Properties.map((p) => this.GetControl(p)))
            }
        }

        CheckChanged(checked) {
            if (checked) {
                const checkboxList = this.DataGrid.GetCheckBoxControlList();
                for (let i = 0; i < checkboxList.length; i++) {
                    if (!checkboxList[i].GetChecked()) { checked = false; break; }
                }
                if (checked) {
                    this.DataGrid.GridHeaderComponent.CheckBoxControl.SetChecked(true)
                }
            }
            else this.DataGrid.GridHeaderComponent.CheckBoxControl.SetChecked(false)
        }

        GetControl(p) {
            switch (p.ControlType) {
                case "LinkButton": return new LinkButton(Object.assign({ RowData: this.Data }, p))
                case "LinkButtonList": return new LinkButtonList(Object.assign({ RowData: this.Data }, p))
                default: return new DataSpan(Object.assign({ Value: this.Data[p.Name] }, p))
            }
        }

        InitTagObject() {
            this.TrTag = HtmlTag.GetById(this.Id)
        }

        EventLoad2() {
            HtmlTag.BindEvent(this.TrTag, "click", e => this.ClickRow(e))
        }

        DataLoad2() {
            if (this.Data && this.SelectIdList && this.SelectIdList.length > 0) {
                let id = this.Data[this.PrimaryKey]
                let list = this.SelectIdList.filter(f => f === id)
                if (list && list.length > 0) { this.DataSelected = true; this.SetSelectRow(); }
            }
        }

        ClickRow() {
            if (this.TrTag.Selected && !this.DataSelected) return
            this.DataSelected = false;
            if (this.TrTag.parentNode && this.TrTag.parentNode.childNodes.length > 0) {
                let n = null;
                for (let i = 0; i < this.TrTag.parentNode.childNodes.length; i++) {
                    n = this.TrTag.parentNode.childNodes[i];
                    n.Selected = false
                    HtmlTag.RemoveClass(n, "SelectTr")
                }
            }
            this.SetSelectRow()
        }

        SetSelectRow() {
            HtmlTag.AddClass(this.TrTag, "SelectTr")
            this.TrTag.Selected = true
            this.CheckBoxControl && this.CheckBoxControl.SetChecked();
        }

        GetValue() {
            return this.Data
        }

        GetHtml() {
            let html = []

            html.push(`<tr id=${this.Id} style="border-bottom:1px solid ${this.BorderColor}">`)

            let borderStyle = "", textAlign = "", chtml = "";
            this.ControlList.forEach((c, i) => {
                chtml = c.GetHtml();
                textAlign = c.TextAlign ? ` text-align:${c.TextAlign}` : "";
                borderStyle = i > 0 ? `border-left:1px solid ${this.BorderColor};` : ""
                html.push(`<td style="width:${c.ColumnWidth}px;${borderStyle}${textAlign}">`)
                html.push(chtml + "</td>")
            })

            html.push("</tr>")

            return html.join("")
        }
    }

})($ns);