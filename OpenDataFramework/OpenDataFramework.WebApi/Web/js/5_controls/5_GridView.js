((ns) => {
    const { Index, Button } = ns.controls
    const { Common, HtmlTag } = ns.utils

    ns.controls.GridView = class GridView extends Index {
        constructor(options) {
            super(options)

            this.Styles = this.Styles || { DivGridAdd: "DivGridAdd" }
            this.Entity.Label = this.Entity.Label || this.Entity.Name
            if (this.ControlWidth) this.Width = this.ControlWidth
            this.Init()
        }

        Init() {
            this.Entity.ExpandPageInit && this.Entity.ExpandPageInit.call(this, ns)
            this.Entity.Properties.forEach((p) => this.InitProperty(p))

            this.DataProperties = this.Entity.Properties.filter((p) => p.IsData).map((p) => Object.assign({}, p, p.DataOptions))
            this.GridViewLayout = new ns.layouts.GridView(this.GetGridViewComponents())

            this.AddButton = new Button({ Action: new ns.actions.GridViewAddAction(this) })

            this.Height += 30
        }

        GetRowClassName() { return "DivRowGridView" }

        InitProperty(p) {
            Common.InitValue(p, ["IsData"], p.DataOptions !== undefined)
            Common.InitValue(p, ["IsEdit"], p.EditOptions !== undefined)
        }

        GetHtml() {
            let html = []

            let id = "record_" + this.Id;
            let recordHtml = `<span id="${id}">共 0 条记录</span>`;
            let addHtml = this.AddButton.GetHtml()
            html.push(`<div class="${this.Styles.DivGridAdd}">`);
            html.push(`<div class="DivAddLeft">${recordHtml}</div>`)
            html.push(`<div class="DivAddRight">${addHtml}</div>`)
            html.push("</div>")
            html.push(this.GridViewLayout.GetHtml())

            return html.join("")
        }

        SaveData(d) { this.DataGridComponent.SaveData(d) }

        GetGridViewComponents() {
            this.DataGridComponent = new ns.components.DataGrid({
                Entity: this.Entity, IsLocalData: true,
                IsDelete: true,
                IsEdit: true,
                Width: this.Width || 0,
                Height: this.Height, Properties: this.DataProperties, IsFixedWidth: true
            })
            return { DataGridComponent: this.DataGridComponent }
        }

        GetValue() {
            return this.DataGridComponent.GetValue()
        }

        SetValue(value) {
            this.DataGridComponent.SetValue(value)
        }

        EventLoad2() {
            this.DataGridComponent.SpanRecord = HtmlTag.GetById("record_" + this.Id);
            this.DataGridComponent.EventLoad()
            this.AddButton.EventLoad()
        }

        DataLoad2() {
            this.DataGridComponent.DataLoad()
            this.AddButton.DataLoad()
        }
    }

})($ns);