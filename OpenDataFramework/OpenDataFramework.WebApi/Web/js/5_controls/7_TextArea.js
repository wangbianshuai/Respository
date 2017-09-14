((ns) => {
    const { Index } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.TextArea = class TextArea extends Index {
        constructor(options) {
            super(options)

            if (this.ControlWidth) this.Width = this.ControlWidth
            this.Width = this.Width || 200

            this.ClassName = this.ClassName || "TextArea"
        }

        GetHtml() {
            this.SetAttribute("name", this.Name)
            this.ClassName && this.SetAttribute("class", this.ClassName)

            let styleList = []
            styleList.push(`width:${this.Width}px;`)
            let height = this.Height - 8
            styleList.push(`height:${height}px;`)
            styleList.length > 0 && this.SetAttribute("style", styleList.join(""))

            let html = []

            html.push(`<textarea  cols="100" rows="100"" id="${this.Id}"`)

            html.push(this.GetAttributeHtml())

            html.push(">")
            html.push("</textarea>")

            return html.join("")
        }
    }

})($ns);