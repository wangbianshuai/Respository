((ns) => {
    const { Index } = ns.layouts

    ns.layouts.MenuLayout = class MenuLayout extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivLoginMenu: "DivLoginMenu" }
        }

        GetHtml() {
            let html = []

            html.push(`<div class="${this.Styles.DivLoginMenu}">`)

            html.push(this.LoginComponent.GetHtml())
            html.push(this.MenuComponent.GetHtml())

            html.push("</div>")

            return html.join("")
        }
    }

})($ns);