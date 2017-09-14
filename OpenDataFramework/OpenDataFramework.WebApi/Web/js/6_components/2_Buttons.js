((ns) => {
    const { Index } = ns.components
    const { Button } = ns.controls

    ns.components.Buttons = class Buttons extends Index {
        constructor(options) {
            super(options)

            this.Actions = this.Actions || []

            this.ControlList = this.Actions.map((a) => new Button({ Action: a, Width: a.Width }))

            this.Styles = this.Styles || { UlButton: "UlButton" }
        }

        GetHtml() {
            let html = []

            html.push(`<ul cass="UlButton">`)
            html = html.concat(this.ControlList.map((c) => "<li>" + c.GetHtml() + "</li>"))
            html.push("</ul>")

            return html.join("")
        }
    }

})($ns);