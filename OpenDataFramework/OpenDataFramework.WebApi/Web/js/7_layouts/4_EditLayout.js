((ns) => {
    const { Index } = ns.layouts

    ns.layouts.EditLayout = class EditLayout extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivEdit: "DivEdit", DivRow: "DivRow" }

            this.Width = 0
            this.Height = 0
        }

        GetHtml() {
            this.GetRowList()

            let html = []

            html.push(`<div class="${this.Styles.DivEdit}">`)
            html = html.concat(this.RowList.map((r) => this.GetRowHtml(r)))
            html.push("</div>")

            return html.join("")
        }

        GetRowHtml(r) {
            let html = []
            let width = 0, height = 0

            let className = r.ClassName ? r.ClassName : this.Styles.DivRow
            html.push(`<div class="${className}"><ul>`)

            r.Components.forEach((c) => {
                html.push("<li>" + c.GetHtml() + "</li>")
                width += c.Width
                height = c.Height > height ? c.Height : height
            })

            this.Width = width > this.Width ? width : this.Width
            this.Height += height

            html.push("</ul></div>")

            return html.join("")
        }
    }

})($ns);