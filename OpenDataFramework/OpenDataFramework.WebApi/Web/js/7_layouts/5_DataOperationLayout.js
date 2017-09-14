((ns) => {
    const { Index } = ns.layouts

    ns.layouts.DataOperationLayout = class DataOperation extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivOperation: "DivOperation" }
        }

        GetHtml() {
            let html = []

            html.push(`<div class="${this.Styles.DivOperation}">`)

            html.push(this.OpeartionComponent.GetHtml())

            html.push("</div>")

            return html.join("")
        }
    }

})($ns);