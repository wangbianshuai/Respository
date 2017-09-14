((ns) => {
    const { Common, HtmlTag } = ns.utils

    ns.components.SelectGridView = class SelectGridView {
        constructor(options) {
            this.Id = Common.CreateGuid();
            options && Object.assign(this, options)

            Common.InitValue(this, ["IsSingle"], true)
        }

        Load() {
            this.Page = new ns.pages.DialogListPage({
                Width: this.Width,
                Height: this.Height,
                GridWidth: this.GridWidth,
                GridHeight: this.GridHeight,
                Title: this.Title,
                IsPage: this.IsPage || false,
                Entity: this.Entity,
                OkAction: { Invoke: (e, c) => this.OkActionInvoke(e, c) },
                IsCheckBox: !this.IsSingle
            })
            this.Page.Load()
        }

        OkActionInvoke(e, c) {
            const dataList = this.Page.GetDataGridCheckedValue();
            if (dataList.length === 0) {
                Common.Alert("请选择数据行！");
                return;
            }
            if (this.SetSelectRows) this.SetSelectRows(dataList).then(() => this.Page.ListDialog.Close())
            else {
                var len = this.SelectDataGrid.DataList.length

                var list = null, newDataList = [], i = 0
                dataList.forEach(p => {
                    list = this.SelectDataGrid.DataList.filter(f => f[this.Entity.PrimaryKey] === p[this.Entity.PrimaryKey])
                    if (list.length === 0) {
                        i++
                        newDataList.push(this.SetSelectRowData(p, i, len))
                    }
                })

                if (newDataList.length > 0) {
                    this.SelectDataGrid.DataList = this.SelectDataGrid.DataList.concat(newDataList)
                    this.SelectDataGrid.SetValue()
                }

                this.Page.ListDialog.Close()
            }
        }
    }

})($ns);