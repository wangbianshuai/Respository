((ns) => {
    const { Index } = ns.components
    const { Common, HtmlTag } = ns.utils
    const { DialogOkAction, DialogCancelAction } = ns.actions
    const { Buttons } = ns.components

    ns.components.Dialog = class Dialog extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DialogBackground: "DialogBackground", DivDialog: "DivDialog" }
            Common.InitValue(this, ["IsClosed", "IsOkButton"], true)
            this.DialogKey = "Dialog_" + this.Id.substring(0, 8);
        }

        InitControls() {
            this.Actions = this.Actions || this.GetActions()
            this.ButtonsComponent = new Buttons({ Actions: this.Actions })
            this.ComponentList = [this.ButtonsComponent]
            this.Width += 50
            this.Height += 100
        }

        GetActions() {
            let actions = []
            let okAction = new DialogOkAction(this)
            if (this.OkLabel) okAction.Label = this.OkLabel
            if (this.IsOkButton) actions.push(okAction)
            if (this.IsClosed) actions.push(new DialogCancelAction(this))
            return actions
        }

        GetHtml() {
            let width = HtmlTag.GetWindowWidth(), height = HtmlTag.GetWindowHeight(), zIndex = Common.GetZIndex()

            let html = []
            html.push(`<div class="${this.Styles.DialogBackground}" id="bg_${this.Id}" style="z-index:${zIndex};">`)
            html.push("</div>")

            let top = Math.round(height / 2 - this.Height / 2 - 30), left = Math.round(width / 2 - this.Width / 2)
            top = top < 10 ? 10 : top
            left = left < 10 ? 10 : left
            width = this.Width, height = this.Height, zIndex = Common.GetZIndex()

            html.push(`<div class="DivRadiusBorder ${this.Styles.DivDialog}" id="${this.Id}"`)
            html.push(` style="position:absolute;width:${width}px;height:${height}px;z-index:${zIndex};top:${top}px;left:${left}px;">`)
            html.push(this.GetHeaderHtml())

            height = height - 80
            html.push(`<div class="DivContent" style="height:${height}px;">${this.Html}</div>`)

            html.push(this.GetButtonsHtml())

            html.push("</div>")

            return html.join("")
        }

        GetButtonsHtml() {
            return "<div class=\"DivButton\">" + this.ButtonsComponent.GetHtml() + "</div>"
        }

        GetHeaderHtml() {
            let html = []

            html.push(`<div class="DivRadiusBorder DivTitleHeader" id="header_${this.Id}">`)
            html.push(`<span class="SpanTitle">${this.Title}</span>`)
            this.IsClosed && html.push("<a href=\"javascript:void(0);\" id=\"close_" + this.Id + "\"><span class=\"ui-icon ui-icon-closethick\"></span></a>")
            html.push("</div>")

            return html.join("")
        }

        Show() {
            this.InitControls()

            HtmlTag.AppendHtml(document.body, this.GetHtml())

            this.DivBackground = HtmlTag.GetById("bg_" + this.Id)
            this.DivDialog = HtmlTag.GetById(this.Id)

            this.IsClosed && HtmlTag.BindEvent(HtmlTag.GetById("close_" + this.Id), "click", () => this.Close())

            const header = HtmlTag.GetById("header_" + this.Id)
            HtmlTag.BindEvent(header, "mousedown", (e) => this.Down(e))
            HtmlTag.OffBindEvent(window, "mousemove." + this.DialogKey);
            HtmlTag.BindEvent(window, "mousemove." + this.DialogKey, (e) => this.Move(e))
            HtmlTag.BindEvent(header, "mouseup", (e) => this.Up(e))

            this.EventLoad()
            this.DataLoad()
        }

        Down(e) {
            this.IsStart = true
            let offset = HtmlTag.GetOffSet(this.DivDialog)
            this.StartX = e.pageX - offset.left
            this.StartY = e.pageY - offset.top
        }

        Move(e) {
            if (this.IsStart) {
                this.IsMove = true

                let width = HtmlTag.GetWindowWidth(), height = HtmlTag.GetWindowHeight()

                let dx = e.pageX - this.StartX
                let dy = e.pageY - this.StartY

                dx = dx + this.Width > width - 20 ? width - this.Width - 20 : dx
                dy = dy + this.Height > height - 20 ? height - this.Height - 20 : dy

                dx = dx < 1 ? 1 : dx
                dy = dy < 1 ? 1 : dy

                HtmlTag.SetStyle(this.DivDialog, { left: dx + "px", top: dy + "px" })
            }
        }

        Up(e) {
            if (this.IsMove) { this.IsStart = false }
        }

        Close() {
            HtmlTag.RemoveElement(document.body, this.DivDialog)
            HtmlTag.RemoveElement(document.body, this.DivBackground)
            HtmlTag.OffBindEvent(window, "mousemove." + this.DialogKey);
        }
    }

})($ns);