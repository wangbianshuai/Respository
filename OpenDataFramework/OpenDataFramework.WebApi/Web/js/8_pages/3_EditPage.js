((ns) => {
    const { Index } = ns.pages
    const { Common } = ns.utils
    const { PropertyItem, Dialog } = ns.components
    const { EditLayout } = ns.layouts
    const { CreateAction, UpdateAction } = ns.actions

    ns.pages.EditPage = class extends Index {
        constructor(options) {
            options.PageName = options.PageName || "EditPage"
            super(options)

            Common.InitValue(this, ["IsDialog"], true)
            this.Title = this.Title || (this.IsUpdate ? this.IsLook ? "查看" : "修改" : "新增") + this.Entity.Label
            this.Styles.EditPage = this.Styles.EditPage || "EditPage"
        }

        PageInit() {
            ns.data.Index.InitEditPageEntityState(this.KeyName)

            this.Entity.ExpandPageInit && this.Entity.ExpandPageInit.call(this, ns)
            this.EditProperties = this.Entity.Properties.filter((p) => p.IsEdit).map((p) => Object.assign({ IsVisible: true }, p, p.EditOptions))

            this.EditLayout = new EditLayout(this.GetEditComponents())

            this.IndexAction = new ns.actions.Index(this)
        }

        GetEditComponents() {
            this.EditComponents = this.EditProperties.filter(f => f.IsVisible).map((p) => new PropertyItem({ Property: p, Page: this }))

            return { ComponentList: this.EditComponents }
        }

        PageLoad() {
            if (this.IsDialog) {
                let html = this.GetHtml()
                let width = this.Width > 0 ? this.Width : this.EditLayout.Width
                let height = this.Height > 0 ? this.Height : this.EditLayout.Height

                this.EditDialog = new ns.components.Dialog({
                    Width: width,
                    Height: height,
                    Html: html,
                    Title: this.Title,
                    IsOkButton: !this.IsLook,
                    OkAction: this.IsUpdate ? new UpdateAction(this) : new CreateAction(this)
                })

                if (this.OkAction) this.EditDialog.OkAction = this.OkAction
                if (this.IsDataStatus && !this.IsLook) {
                    this.EditDialog.Actions = this.GetDialogActions(this.EditDialog);
                }

                this.EditDialog.Show()
            }
            else {
                HtmlTag.SetHtml(document.body, this.GetHtml())
            }
            this.EventLoad()
            this.DataLoad()
        }

        GetDialogActions(dialog) {
            let actions = []
            actions.push(new ns.actions.DialogSaveAction(dialog))
            actions.push(new ns.actions.DialogSubmitAction(dialog))
            actions.push(new ns.actions.DialogCancelAction(dialog))
            return actions
        }

        GetHtml() {
            let html = []
            html.push(`<div class="${this.Styles.EditPage}">`)

            html.push(this.EditLayout.GetHtml())

            html.push("</div>")
            return html.join("")
        }

        EventLoad() {
            this.EditComponents.forEach((c) => c.EventLoad())
        }

        DataLoad() {
            this.EditComponents.forEach((c) => c.DataLoad())

            if (this.IsUpdate) {
                if (this.IsLocalData) {
                    this.Entity.EntityData = this.RowData
                    this.EditComponents.forEach(c => c.SetValue(this.RowData[c.Property.Name]))
                }
                else {
                    this.GetEntityData()
                }
            }
        }

        GetEntityData() {
            this.IndexAction.GetEntityData(this.Entity, this.EditProperties.map(p => p.Name), this.RowData[this.Entity.PrimaryKey]).then(res => {
                if (res.IsSuccess) {
                    let data = Common.ArrayFirst(res.Data.DataList)
                    if (data) {
                        this.EntityData = data;
                        this.Entity.EntityData = data
                        this.Entity.ExpandGetEditData && this.Entity.ExpandGetEditData.call(this, data, ns)
                        this.EditComponents.forEach(c => c.SetValue(data[c.Property.Name]))
                    }
                }
                else {
                    Common.Alert(res.Message)
                }
            })
        }

        GetEditData() {
            let data = {}
            if (this.IsUpdate) {
                data[this.Entity.PrimaryKey] = this.RowData[this.Entity.PrimaryKey]
                data.RowVersion = this.RowData.RowVersion
            }
            let blValidate = true
            let value = "", c = null
            for (let i = 0; i < this.EditComponents.length; i++) {
                c = this.EditComponents[i]
                value = c.GetValue()
                if (c.Validate(value) === false) {
                    blValidate = false
                    break
                }
                if (!Common.IsNullOrEmpty(value)) {
                    data[c.Property.Name] = value
                }
                else if (this.IsUpdate && !c.IsPassword) {
                    data[c.Property.Name] = null
                }
            }
            if (!blValidate) return false

            if (this.Entity.ExpandSetEditData) data = this.Entity.ExpandSetEditData.call(this, data, this.IsUpdate, ns)
            if (data === false) return false

            if (this.IsUpdate && !this.IsLocalData && this.CompareValueEquals(data)) return false

            return data
        }

        CompareValueEquals(data) {
            if (!this.EntityData) return false;
            let blEquals = true
            for (let key in data) {
                if (key != this.Entity.PrimaryKey && key != "RowVersion" && !Common.IsEquals(this.EntityData[key], data[key])) {
                    blEquals = false
                    break
                }
            }
            if (blEquals) Common.Alert("对不起，您未对信息进行编辑！")
            return blEquals
        }

        ClearControlValue() {
            this.EditComponents.forEach((c) => c.SetValue(""))
        }

        GetDataGridComponent(name) {
            var list = this.EditComponents.filter(f => f.Property.Name === name)
            if (list.length === 0) return null
            return list[0].ControlList[1].DataGridComponent
        }
    }

})($ns);