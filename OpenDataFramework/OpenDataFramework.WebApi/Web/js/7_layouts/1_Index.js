((ns) => {
    const { Common } = ns.utils

    ns.layouts.Index = class Index {
        constructor(options) {
            this.Id = Common.CreateGuid()
            this.ComponentList = []

            options && Object.assign(this, options)
        }

        ExpandRowComponents() { }

        GetRowList() {
            let rowCount = 0
            this.ComponentList.forEach(c => { if (c.Property.X > rowCount) rowCount = c.Property.X })
            this.RowCount = rowCount

            this.RowList = []
            let row = null, list = null, className = null

            for (let i = 0; i < rowCount; i++) {
                list = this.ComponentList.filter(f => f.Property.X === i + 1)
                list = list.sort((a, b) => a.Property.Y > b.Property.Y ? 1 : -1)
                if (list.length > 0 && list[0].GetRowClassName) className = list[0].GetRowClassName()
                row = { Components: list, ClassName: className }
                this.ExpandRowComponents(row, i)

                if (row.Components.length > 0) this.RowList.push(row)
            }

            return this.RowList
        }
    }

})($ns);