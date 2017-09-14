((ns) => {
    const { Common } = ns.utils
    const { SearchAction, NewAddActions } = ns.actions

    ns.pages.Index = class Index {
        constructor(options) {
            this.Id = Common.CreateGuid()
            this.Entity = { Properties: [] }

            options && Object.assign(this, options)

            this.Styles = this.Styles || { HtmlPage: "HtmlPage" }

            this.InitEntity();

            this.Entity.Properties.forEach((p) => this.InitProperty(p))

            this.KeyName = this.PageName + "_" + this.Entity.Id
        }

        Load() {
            this.PageInit()
            this.PageLoad()
        }

        PageInit() { }

        InitEntity() {
            this.Entity.Label = this.Entity.Label || this.Entity.Name
            this.Entity.Id = this.Entity.Id || Common.CreateGuid();
            Common.InitValue(this.Entity, ["IsSelectKey"], true)
        }

        InitProperty(p) {
            Common.InitValue(p, ["IsSearch"], p.SearchOptions !== undefined)
            Common.InitValue(p, ["IsData"], p.DataOptions !== undefined)
            Common.InitValue(p, ["IsEdit"], p.EditOptions !== undefined)
            Common.InitValue(p, ["IsVisible"], true)
            p.Label = p.Label || p.Name
        }

        PageLoad() { }
    }

})($ns);