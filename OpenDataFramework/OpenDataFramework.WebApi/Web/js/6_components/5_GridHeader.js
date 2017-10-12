((ns) => {
    const { Index } = ns.components
    const { DataSpan, DataCheckBox, DownList } = ns.controls
    const { HtmlTag } = ns.utils

    ns.components.GridHeader = class GridHeader extends Index {
        constructor(options) {
            super(options)

            this.BorderColor = this.BorderColor || "#a6c9e2"
            this.Styles = this.Styles || { DivHeader: "DivHeader" }

            this.InitControls()
        }

        InitControls() {
            this.ControlList = []
            if (this.IsCheckBox) {
                this.CheckBoxControl = new DataCheckBox({ CheckChanged: (checked) => this.CheckChanged(checked) });
                this.ControlList.push(this.CheckBoxControl);
            }
            this.ControlList = this.ControlList.concat(this.Properties.map((p) => {
                if (p.Name === "DataStatusName") return new DownList(Object.assign({
                    ControlWidth: 60,
                    Options: [{ Value: "", Text: "状态" },
                    { Value: "0", Text: "未提交" },
                    { Value: "1", Text: "已提交" }],
                    IsEmpty: false,
                    StyleString: "height:22px;margin:1px 2px 1px 2px;",
                    Action: this.GetStatusChangeAction()
                }, p))
                return new DataSpan(Object.assign({ Value: p.Label || p.Name, IsLabel: true }, p))
            }))
        }

        GetStatusChangeAction() {
            var a = new ns.actions.Index(this);
            a.EventNames = ["change"]
            a.Invoke = (e, c) => {
                this.DataGrid.SearchAction.DataStatus = c.GetValue()
                this.DataGrid.SearchAction.Invoke(e, c)
            }
            return a
        }

        CheckChanged(checked) {
            this.DataGrid.GetCheckBoxControlList().forEach(c => c.SetChecked(checked))
        }

        InitTagObject() {
            this.TableTag = HtmlTag.GetById(this.Id)
        }

        GetGridWidth() {
            return HtmlTag.GetWindowWidth() - 40
        }

        GetHtml() {
            let html = []
            let width = this.IsFixedWidth ? this.Width : this.GetGridWidth()
            width = width > this.Width ? width : this.Width;

            html.push(`<div class="${this.Styles.DivHeader}"><div style="padding-right:20px;">`)
            html.push(`<table cellpadding="0" cellspacing="0" border="0" style="width:${width}px" id="${this.Id}"><thead><tr>`)
            let borderStyle = ""
            this.ControlList.forEach((c, i) => {
                borderStyle = i > 0 ? `border-left:1px solid ${this.BorderColor};` : ""
                html.push(`<th style="width:${c.ColumnWidth}px;${borderStyle}">`)
                html.push(c.GetHtml() + "</th>")
            })

            html.push("</tr></thead></table></div></div>")

            return html.join("")
        }
    }

})($ns);