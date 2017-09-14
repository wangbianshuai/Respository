((ns) => {
    const { Index } = ns.components
    const { SpanLabel, LinkButton } = ns.controls
    const { ChangePasswordAction } = ns.actions

    ns.components.Login = class Login extends Index {
        constructor(options) {
            super(options)

            this.Init()
        }

        Init() {
            const { LoginUser } = this.Page

            let loginInfo = `${LoginUser.LoginName}，欢迎您`
            if (LoginUser.LastLoginDate) {
                loginInfo = `${loginInfo}，上一次登录时间：${LoginUser.LastLoginDate}`
            }
            else {
                loginInfo = `${loginInfo}，第一次登录系统`
            }

            this.ControlList = []
            this.ControlList.push(new SpanLabel({ IsWidth: false, IsColon: false, Label: loginInfo }))
            this.ControlList.push(new LinkButton({ Action: new ChangePasswordAction(this.Page) }))
        }

        GetHtml() {
            let html = []

            html.push(`<div class="DivLogin"><ul>`)
            html = html.concat(this.ControlList.map((c) => "<li>" + c.GetHtml() + "</li>"))
            html.push(`<li><a href="Index.aspx?page=Default">首页</a></li>`)
            let loginName = escape("登录")
            let id = this.Page.LoginUser ? this.Page.LoginUser.UserId : ""
            html.push(`<li><a href="Index.aspx?page=${loginName}">退出</a></li>`)
            html.push("</ul></div>")

            return html.join("")
        }
    }

})($ns);