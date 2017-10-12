((ns) => {
    const { Index } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.DownList = class DownList extends Index {
        constructor(options) {
            super(options)

            if (this.ControlWidth) this.Width = this.ControlWidth
            this.Width = this.Width || 200
            Common.InitValue(this, ["IsEmpty"], true)

            this.ClassName = this.ClassName || "DownList"
        }

        GetHtml() {
            this.SetAttribute("name", this.Name)
            this.ClassName && this.SetAttribute("class", this.ClassName)

            let styleList = []
            styleList.push(`width:${this.Width + 3}px;`)
            if (this.StyleString) styleList.push(this.StyleString)
            styleList.length > 0 && this.SetAttribute("style", styleList.join(""))

            let html = []

            html.push(`<select id="${this.Id}"`)

            html.push(this.GetAttributeHtml())

            html.push(">")
            html.push(this.GetOptionsHtml())
            html.push("<select>")

            return html.join("")
        }

        GetOptionsHtml() {
            let html = []
            this.IsEmpty && html.push("<option value=\"\"></option>")
            if (this.Options && this.Options.length > 0) {
                let v, t
                this.Options.forEach(p => {
                    if (p.Value != undefined && p.Text != undefined) {
                        v = p.Value
                        t = p.Text
                    }
                    else {
                        v = p
                        t = p
                    }
                    html.push(`<option value="${v}">${t}</option>`)
                })
            }
            else {
                !this.IsEmpty && html.push("<option value=\"\"></option>")
            }

            return html.join("")
        }

        LoadOptionHtml() {
            let html = []
            const { TextName, ValueName } = this.DataSource;
            this.IsEmpty && html.push("<option value=\"\"></option>")
            if (this.DataList && this.DataList.length > 0) {
                let v, t, s
                this.DataList.forEach(d => {
                    v = d[ValueName], t = d[TextName];
                    s = Common.IsEquals(v, this.Value) ? " selected=\"selected\"" : "";
                    html.push(`<option value="${v}"${s}>${t}</option>`)
                })
            }
            else {
                !this.IsEmpty && html.push("<option></option>")
            }

            HtmlTag.SetHtml(this.Element, html.join(""));
        }

        EventLoad2() {
            this.Action && this.Action.EventNames.forEach((name) => { HtmlTag.BindEvent(this.Element, name, (e) => this.Action.Invoke(e, this)) })
        }

        DataLoad2() {
            this.DataSource && this.GetDataList();
            if (this.DataSource) {
                HtmlTag.SetHtml(this.Element, "<option value=\"\">数据源加载中……</option>");
                this.GetDataList().then(() => this.LoadOptionHtml())
            }
        }
    }

})($ns);