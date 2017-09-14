((ns) => {
    const { Index } = ns.layouts

    ns.layouts.GridView = class GridView extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivGridView: "DivGridView" }
        }

        GetHtml() {
            let html = []

            html.push(`<div class="${this.Styles.DivGridView}">`)

            html.push(this.DataGridComponent.GetHtml())

            if (this.DataPagingComponent) {
                html.push(this.DataPagingComponent.GetHtml())
            }
            html.push("</div>")

            return html.join("")
        }
    }

})($ns);