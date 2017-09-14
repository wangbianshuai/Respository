((ns) => {
    const { Common, HtmlTag } = ns.utils

    ns.components.Loading = class Loading {
        constructor() {
            this.Id = Common.CreateGuid();
        }

        GetHtml() {
            let zIndex= Common.GetZIndex();

            let html = []
            html.push(`<div class="DivLoading" id="${this.Id}" style="z-index:${zIndex};">`)
            html.push("</div>")

            return html.join("")
        }

        Show() {
            HtmlTag.AppendHtml(document.body, this.GetHtml())

            this.DivLoading = HtmlTag.GetById(this.Id)
        }

        Close() {
            HtmlTag.RemoveElement(document.body, this.DivLoading);
        }
    }

})($ns);