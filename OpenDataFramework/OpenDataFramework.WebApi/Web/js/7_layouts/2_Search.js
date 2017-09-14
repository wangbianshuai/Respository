((ns) => {
    const { Index } = ns.layouts

    ns.layouts.Search = class Search extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivSearch: "DivSearch", DivRow: "DivRow" }
        }

        GetHtml() {
            this.GetRowList()

            let html = []

            html.push(`<div class="${this.Styles.DivSearch}">`)

            html = html.concat(this.RowList.map((r) => this.GetRowHtml(r)))

            html.push("</div>")

            return html.join("")
        }

        GetRowHtml(r) {
            let html = []

            html.push(`<div class="${this.Styles.DivRow}"><ul>`)

            html = html.concat(r.Components.map((c) => "<li>" + c.GetHtml() + "</li>"))

            html.push("</ul></div>")

            return html.join("")
        }

        ExpandRowComponents(row, i) {
            if (i === this.RowCount - 1 && this.ButtonComponentList && this.ButtonComponentList.length > 0) {
                row.Components = row.Components.concat(this.ButtonComponentList)
            }
        }
    }

})($ns);