((ns) => {
    const { Index } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.Button = class Button extends Index {
        constructor(options) {
            super(options)

            this.Width = this.Width || 60
            this.Label = this.Label || this.Name
        }

        GetHtml() {
            this.SetAttribute("value", this.Action.Label || this.Label)
            this.Action.Title && this.SetAttribute("title", this.Action.Title)
            this.ClassName && this.SetAttribute("class", this.ClassName)

            let styleList = []
            styleList.push(`width:${this.Width}px;`)
            this.SetAttribute("style", styleList.join(""))

            return this.GetInputHtml("button")
        }

        EventLoad2() {
            this.Action.EventNames.forEach((name) => { HtmlTag.BindEvent(this.Element, name, (e) => this.Action.Invoke(e, this)) })
            if (this.Action.IsOkFocus) this.Element.focus()
        }

        SetValue() { }

        GetValue() { }
    }

    ns.controls.LinkButton = class LinkButton extends Index {
        constructor(options) {
            super(options)

            this.Label = this.Label || this.Action.Label
        }

        GetHtml() {
            let v = this.Label
            if (this.Action.GetText) v = this.Action.GetText(this.RowData);
            if (Common.IsNullOrEmpty(v)) return "";
            return `<a href="javascript:void(0);" id=${this.Id}>${v}</a>`
        }

        EventLoad2() {
            this.Action.EventNames.forEach((name) => { HtmlTag.BindEvent(this.Element, name, (e) => this.Action.Invoke(e, this)) })
        }
    }

    ns.controls.LinkButtonList = class LinkButtonList extends Index {
        constructor(options) {
            super(options)
        }

        GetHtml() {
            this.LinkButtons = this.Actions.map(a => new ns.controls.LinkButton({ RowData: this.RowData, Action: a }))

            let html = ["<div class=\"ASpanList\">"];
            html = html.concat(this.LinkButtons.map(m => "<span>" + m.GetHtml() + "</span>"));
            html.push("</div>")

            return html.join("");
        }

        EventLoad2() {
            this.LinkButtons.forEach(a => a.EventLoad());
        }

        DataLoad2() {
            this.LinkButtons.forEach(a => a.DataLoad());
        }
    }

})($ns);