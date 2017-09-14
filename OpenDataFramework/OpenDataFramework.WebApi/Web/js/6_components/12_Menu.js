((ns) => {
    const { Index } = ns.components
    const { Common, HtmlTag } = ns.utils

    ns.components.Menu = class Menu extends Index {
        constructor(options) {
            super(options)
        }

        GetHtml() {
            let html = []

            html.push(`<div class="DivMenu" id=${this.Id}>`)
            html.push(`<div class="DivMenu1">`)
            html.push("</div>")
            html.push(`<div class="DivMenu2">`)
            html.push("</div>")
            html.push("</div>")

            return html.join("")
        }

        InitTagObject() {
            this.MenuTag = HtmlTag.GetById(this.Id)
        }

        DataLoad2() {
            this.GetFirstMenuList().then(() => {
                this.GetPageMenuList().then(() => {
                    this.GetAdminMenu().then(() => {
                        this.SetMenuList()
                    })
                })
            })
        }

        GetFirstMenuList() {
            return this.GetKeyValueList("菜单", "=", "菜单").then(res => {
                this.FirstMenuList = []
                if (res != null) {
                    let data = Common.ArrayFirst(res)
                    if (data) {
                        this.FirstMenuList = Common.Split(data["值"], ["，", ","]).map(m => { return { Name: m } })
                    }
                }
                return Promise.resolve()
            })
        }

        GetKeyValueList(cacheName, logic, value) {
            return ns.data.Cache.GetDataList(cacheName, "键值配置", ["键名", "值"], [{ Name: "键名", Logic: logic, Value: value }])
        }

        GetAdminMenu() {
            let value = "管理员，管理员菜单"

            return this.GetKeyValueList("管理员菜单", "in", value).then(res => {
                this.AdminUserList = []
                this.AdminMenuList = []
                if (res != null) {
                    res.forEach(item => {
                        if (item["键名"] === "管理员") this.AdminUserList = Common.Split(item["值"], ["，", ","])
                        if (item["键名"] === "管理员菜单") this.AdminMenuList = Common.Split(item["值"], ["，", ","])
                    })
                    if (this.Page.LoginUser) {
                        let list = this.AdminUserList.filter(f => Common.IsEquals(f, this.Page.LoginUser.LoginName))
                        this.IsAdmin = list.length === 1
                        this.SetLogoutHref()
                    }
                }
                return Promise.resolve()
            })
        }

        SetLogoutHref() {
            if (this.IsAdmin) {
                let logout = HtmlTag.GetById("alogout_" + this.Page.LoginUser.UserId);
                let href = HtmlTag.GetAttribute(logout, "href")
                if (href) {
                    href += "&debug=true";
                    HtmlTag.SetAttribute(logout, "href", href);
                }
            }
        }

        GetPageMenuList() {
            let value = this.FirstMenuList.map(m => `菜单-${m.Name}`)

            return this.GetKeyValueList("页面菜单", "in", value.join(",")).then(res => {
                this.PageDataList = []
                if (res != null) {
                    res.forEach(item => {
                        Common.Split(item["值"], ["，", ","]).forEach(v => {
                            this.PageDataList.push({ Name: v, MenuName: item["键名"].replace("菜单-", "") })
                        })
                    })
                }
                return Promise.resolve()
            })
        }

        SetMenuList() {
            this.MenuList = []

            let firstMenuList = []
            let list = null, selected2 = false, selected = false, name = ""

            if (this.IsAdmin) {
                firstMenuList = this.FirstMenuList
            }
            else {
                this.FirstMenuList.forEach(m => {
                    list = this.AdminMenuList.filter(f => Common.IsEquals(f, m.Name))
                    list.length === 0 && firstMenuList.push(m)
                })
            }

            firstMenuList.forEach(m => {
                list = this.PageDataList.filter(f => f.MenuName === m.Name)
                if (list && list.length > 0) {
                    selected = false

                    m.ChildMenuList = list.map(m2 => {
                        name = m2.Name
                        selected2 = this.Page.Name === name
                        if (selected2) selected = true
                        return {
                            Name: name,
                            Selected: selected2,
                            Url: this.GetUrl(name)
                        }
                    })

                    m.Selected = selected
                    m.Id = Common.CreateGuid()

                    this.MenuList.push(m)
                }
            })

            this.LoadMenuHtml(firstMenuList)
        }

        LoadMenuHtml(firstMenuList) {
            HtmlTag.SetHtml(this.MenuTag, this.GetMenuHtml())
            firstMenuList.forEach(m => {
                HtmlTag.BindEvent(HtmlTag.GetById(m.Id), "click", () => {
                    firstMenuList.forEach(m2 => {
                        m2.Selected = m.Id === m2.Id
                    })
                    this.LoadMenuHtml(firstMenuList)
                })
            })
        }

        GetUrl(pageName) {
            return "Index.aspx?page=" + escape(pageName)
        }

        GetMenuHtml() {
            let html = []

            html.push(`<div class="DivMenu1"><div class="DivMenuRight">`)

            let menu = null
            this.MenuList.forEach(m => {
                if (m.Selected) {
                    html.push(`<p>${m.Name}</p>`)
                    menu = m
                }
                else {
                    html.push(`<a href="javascript:void(0);" id=${m.Id}>${m.Name}</a>`)
                }
            })

            html.push("</div></div>")
            html.push(`<div class="DivMenu2"><ul>`)

            let className = ""
            if (menu && menu.ChildMenuList.length > 0) {
                menu.ChildMenuList.forEach(m => {
                    if (m.Selected) className = " class=\"Active\""
                    else className = ""
                    html.push(`<li><a href="${m.Url}"${className}>${m.Name}</a></li>`)
                })
            }

            html.push("</ul></div>")

            return html.join("")
        }
    }

})($ns);