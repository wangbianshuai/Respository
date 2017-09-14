((ns) => {
    const { Common, HtmlTag } = ns.utils
    const { ListPage } = ns.pages
    const { Search, GridView } = ns.layouts
    const { Buttons, PropertyItem, DataGrid, DataPaging } = ns.components
    const { SearchAction } = ns.actions

    ns.pages.DialogListPage = class DialogListPage extends ListPage {
        constructor(options) {
            options.PageName = "DialogListPage";
            options.IsDialog = true
            options.IsNewAdd = false
            options.IsExcelExport = false
            options.IsExcelImport = false
            options.IsEdit = false
            options.IsDelete2 = false
            options.IsDataRight = false
            options.IsDataStatus = false
            options.IsLookLog = false
            options.IsFixedWidth = true
            super(options)
        }

        PageLoad() {
            this.ListDialog = new ns.components.Dialog({
                Width: this.Width,
                Height: this.Height,
                Html: this.GetHtml(),
                Title: this.Title,
                IsOkButton: this.OkAction !== undefined,
                OkAction: this.OkAction
            })
            this.ListDialog.Show()

            this.EventLoad()
            this.DataLoad()

            this.SearchActions && this.SearchActions[0].Invoke()
        }
    }

})($ns);