((ns) => {
    const { Common } = ns.utils

    ns.components.AlertConfirm = class AlertConfirm {
        constructor(options) {
            this.Id = Common.CreateGuid()

            options && Object.assign(this, options)

            this.Init()
        }

        Init() {
            this.Message = Common.IsNullOrEmpty(this.Message) ? "" : this.Message.toString()
            this.Message = this.Message.replace(/</g, "&lt;")
            this.Message = this.Message.replace(/>/g, "&gt;")

            this.ImgDivClassName = this.IsConfirm ? "DivConfirm" : "DivWarn"

            var width = 300
            var height = 100

            var width1 = this.Message.length * 15
            if (width1 > 500) {
                width = 500
                height = 150
            }
            else if (width1 > width) {
                width = width1
            }

            this.Width = width
            this.Height = height
        }

        GetHtml() {
            let html = []

            html.push("<table class=\"Alert\" border=\"0\"cellpadding=\"0\" cellspacing=\"0\"><tr align=\"left\">")
            html.push(`<td valign="top" width="40px"><div class="${this.ImgDivClassName}"></div></td>`)
            html.push(`<td valign="top"><div class="Text"><span>${this.Message}</span></div></td>`)
            html.push("</tr></table>")

            return html.join("")
        }

        ShowDialog(resolve) {
            let dialog = new ns.components.Dialog({
                Width: this.Width,
                Height: this.Height,
                Html: this.GetHtml(),
                IsClosed: false,
                OkAction: {
                    Invoke: () => {
                        dialog.Close()
                        resolve()
                    }
                },
                Title: this.IsConfirm ? "确认信息" : "提示信息"
            })

            let actions = [new ns.actions.DialogOkAction(dialog)]
            actions[0].IsOkFocus = true

            if (this.IsConfirm) {
                dialog.IsClosed = true
                actions.push(new ns.actions.DialogCancelAction(dialog))
            }
            dialog.Actions = actions

            dialog.Show()
        }

        Show() {
            return new Promise((resolve, reject) => {
                this.ShowDialog(resolve)
            })
        }
    }

})($ns);