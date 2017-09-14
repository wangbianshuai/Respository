((ns) => {
    const { Index } = ns.layouts

    ns.layouts.TableLayout = class EditLayout extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivTable: "DivTable" }

            this.Width = 0
            this.Height = 0
        }

        GetHtml() {
            this.GetRowList()

            let html = []

            html.push(`<div class="${this.Styles.DivTable}">`)
            html.push(`<table cellpadding="0" cellspacing="0" border="0" style="width:100%" id="${this.Id}"><tbody>`)
            html = html.concat(this.RowList.map((r) => this.GetRowHtml(r)))
            html.push("</tbody></table></div>")

            return html.join("")
        }

        GetRowHtml(r) {
            let html = []

            html.push(`<tr">`)

            r.Components.forEach((c) => {
                html.push(c.GetHtml())
            })

            html.push("</tr>")

            return html.join("")
        }
    }

})($ns);