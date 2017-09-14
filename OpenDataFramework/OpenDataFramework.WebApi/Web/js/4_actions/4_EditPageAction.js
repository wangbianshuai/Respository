((ns) => {
    const { Index } = ns.actions
    const { Common } = ns.utils

    ns.actions.CreateAction = class CreateAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
        }

        Invoke(e, c) {
            this.Edit(c)
        }
    }

    ns.actions.UpdateAction = class UpdateAction extends Index {
        constructor(options) {
            super(options)
        }

        Invoke(e, c) {
            this.Edit(c, true)
        }
    }

    ns.actions.GridViewAddAction = class GridViewAddAction extends Index {
        constructor(gridView) {
            super(gridView)

            this.Label = "添加"
            this.GridView = gridView
        }

        Invoke(e, c) {
            new ns.pages.EditPage({ Entity: this.GridView.Entity, IsLocalData: true, SaveData: (d) => this.GridView.SaveData(d) }).Load()
        }
    }

})($ns);