((ns) => {
    const { Common, HtmlTag } = ns.utils
    const { Index } = ns.pages
    const { Search, GridView, DataOperationLayout, MenuLayout, TableLayout } = ns.layouts
    const { Buttons, PropertyItem, DataGrid, DataPaging } = ns.components
    const { SearchAction, NewAddAction, ExcelExportAction, ExcelImportAction, LookOperationLogAction2, BatchDeleteAction, BatchSubmitAction, BatchRejectAction } = ns.actions

    ns.pages.ListPage = class ListPage extends Index {
        constructor(options) {
            super(options)

            this.Title = this.Title || this.Entity.Label + "列表"
            if (!this.IsDialog) document.title = this.Title

            const names = ["IsPage", "IsBatchSubmit", "IsBatchReject", "IsBatchDelete", "IsNewAdd", "IsExcelExport", "IsExcelImport", "IsEdit", "IsDelete2", "IsDataRight", "IsDataStatus", "IsLookLog"]
            Common.InitValue(this, names, true)
            this.PageSize = this.PageSize || 20
            this.IsDefault = this.Name === "Default";
        }

        PageInit() {
            if (!this.IsDialog) this.QueryString = Common.GetQueryString()
            this.SetLoginUser();

            ns.data.Index.InitListPageEntityState(this.KeyName)

            if (!this.IsDialog) this.MenuLayout = new MenuLayout(this.GetMenuComponents())
            if (this.IsDefault) return;

            this.Entity.ExpandPageInit && this.Entity.ExpandPageInit.call(this, ns)

            this.SearchProperties = this.Entity.Properties.filter((p) => p.IsSearch).map((p) => Object.assign({}, p, p.SearchOptions))
            this.DataProperties = this.Entity.Properties.filter((p) => p.IsData && p.IsVisible).map((p) => Object.assign({}, p, p.DataOptions))
            this.SelectNames = this.Entity.Properties.filter((p) => p.IsData).map((p) => p.Name)

            this.SerachLayout = new Search(this.GetSearchComponents())
            this.GridViewLayout = new GridView(this.GetGridViewComponents())
            this.DataOperationLayout = new DataOperationLayout(this.GetOperationComponents())
        }

        SetLoginUser() {
            var loginInfo = Common.GetStorage("LoginInfo");
            if (!loginInfo) {
                Common.ToLogin();
            }
            else {
                this.LoginUser = JSON.parse(loginInfo);
            }
        }

        GetMenuComponents() {
            this.MenuComponent = new ns.components.Menu({ Page: this })
            this.LoginComponent = new ns.components.Login({ Page: this })
            return { MenuComponent: this.MenuComponent, LoginComponent: this.LoginComponent }
        }

        GetOperationComponents() {
            const { IsExcelExport, IsExcelImport, IsDelete2, IsDataStatus, IsLookLog, IsBatchDelete, IsBatchSubmit, IsBatchReject } = this
            this.OpeartionActions = []

            let blDataRight3 = this.LoginUser && this.LoginUser.DataRight === 3

            IsExcelExport && this.OpeartionActions.push(new ExcelExportAction(this))
            IsExcelImport && this.OpeartionActions.push(new ExcelImportAction(this))
            IsDelete2 && IsBatchDelete && this.OpeartionActions.push(new BatchDeleteAction(this))
            IsDataStatus && IsBatchSubmit && this.OpeartionActions.push(new BatchSubmitAction(this))
            IsDataStatus && IsBatchReject && blDataRight3 && this.OpeartionActions.push(new BatchRejectAction(this))
            IsLookLog && blDataRight3 && this.OpeartionActions.push(new LookOperationLogAction2(this))

            this.OperationButtonsComponent = new Buttons({ Actions: this.OpeartionActions })

            return { OpeartionComponent: this.OperationButtonsComponent }
        }

        GetOrderByList() {
            if (this.Entity.OrderByList) return this.Entity.OrderByList;
            let orderByList = [{ Name: "CreateDate", IsDesc: true }]
            return orderByList
        }

        GetIsCheckBox() {
            if (this.IsCheckBox !== undefined) return this.IsCheckBox
            if (!this.IsDelete2 && !this.IsDataStatus) return false

            let blCheckBox = false
            blCheckBox = this.IsDelete2 && this.IsBatchDelete
            if (!blCheckBox) blCheckBox = this.IsDataStatus && (this.IsBatchReject || this.IsBatchSubmit)

            return blCheckBox
        }

        GetGridViewComponents() {
            this.DataGridComponent = new DataGrid({
                Entity: this.Entity,
                Properties: this.DataProperties,
                KeyName: this.KeyName,
                IsEdit: this.IsEdit,
                IsDelete: this.IsDelete2,
                IsDataRight: this.IsDataRight,
                IsDataStatus: this.IsDataStatus,
                IsLookLog: this.IsLookLog,
                LoginUser: this.LoginUser,
                IsCheckBox: this.GetIsCheckBox(),
                IsFixedWidth: this.IsFixedWidth,
                SearchAction: this.SearchActions[0]
            })
            if (this.IsDialog && this.GridWidth) {
                this.DataGridComponent.Width = this.GridWidth;
                this.DataGridComponent.Height = this.GridHeight;
            }

            this.DataPagingComponent = new DataPaging({
                KeyName: this.KeyName,
                PageSize: this.PageSize,
                IsPage: this.IsPage,
                SearchAction: this.SearchActions[0],
            })

            return { DataGridComponent: this.DataGridComponent, DataPagingComponent: this.DataPagingComponent }
        }

        GetSearchComponents() {
            this.SearchButtonsComponent = new Buttons({ Actions: this.GetSearchActions() })
            this.SearchComponents = this.SearchProperties.filter(f => f.IsVisible).map((p) => new PropertyItem({
                Property: p,
                EnterControl: this.SearchButtonsComponent.ControlList[0]
            }))

            return { ComponentList: this.SearchComponents, ButtonComponentList: [this.SearchButtonsComponent] }
        }

        GetSearchActions() {
            this.SearchActions = []

            this.SearchActions.push(new SearchAction(this))
            this.IsNewAdd && this.SearchActions.push(new NewAddAction(this))

            return this.SearchActions
        }

        PageLoad() {
            HtmlTag.SetHtml(document.body, this.GetHtml())

            this.EventLoad()
            this.DataLoad()

            this.SearchActions && this.SearchActions[0].Invoke()
        }

        GetHtml() {
            let html = []
            html.push(`<div class="${this.Styles.HtmlPage}">`)

            this.MenuLayout && html.push(this.MenuLayout.GetHtml())

            if (!this.IsDefault) {
                html.push(this.SerachLayout.GetHtml())
                this.OpeartionActions.length > 0 && html.push(this.DataOperationLayout.GetHtml())
                html.push(this.GridViewLayout.GetHtml())
            }
            else {
                html.push(`<div id="divDefault_${this.Id}"></div>`);
            }

            html.push("</div>")
            return html.join("")
        }

        EventLoad() {
            this.MenuComponent && this.MenuComponent.EventLoad()
            this.LoginComponent && this.LoginComponent.EventLoad()
            if (this.IsDefault) return

            this.SearchComponents.forEach((c) => c.EventLoad())
            this.SearchButtonsComponent.EventLoad()

            this.DataGridComponent.EventLoad()
            this.DataPagingComponent && this.DataPagingComponent.EventLoad()

            this.SearchActions[0].InitConditionList = this.GetSearchCondition()

            this.OpeartionActions.length > 0 && this.OperationButtonsComponent.EventLoad()
        }

        DataLoad() {
            this.MenuComponent && this.MenuComponent.DataLoad()
            this.LoginComponent && this.LoginComponent.DataLoad()
            if (this.IsDefault) {
                this.SetDefaultHtml();
                return;
            }

            this.SearchComponents.forEach((c) => c.DataLoad())
            this.SearchButtonsComponent.DataLoad()

            this.DataGridComponent.DataLoad()
            this.DataPagingComponent && this.DataPagingComponent.DataLoad()

            this.OpeartionActions.length > 0 && this.OperationButtonsComponent.DataLoad()
        }

        SetDefaultHtml() {
            ns.data.Cache.GetDataList("首页配置", "默认页", ["属性名", "属性值", "行位置", "列位置"], []).then(res => {
                if (res != null) {
                    let devDefault = HtmlTag.GetById("divDefault_" + this.Id);
                    HtmlTag.SetHtml(devDefault, this.GetDefaultHtml(res));

                    this.DefaultPropertyComponents.forEach((c) => {
                        c.EventLoad()
                        c.DataLoad()
                    })
                }
            });
        }

        GetDefaultHtml(dataList) {
            const propertyList = dataList.map(m => {
                return {
                    Name: m["属性名"],
                    Label: m["属性名"],
                    ControlType: "SpanText",
                    IsWidth: false,
                    DefaultValue: m["属性值"],
                    X: m["行位置"],
                    Y: m["列位置"]
                }
            })

            this.DefaultPropertyComponents = propertyList.map((p) => new PropertyItem({ Property: p, IsTd: true, Page: this }))
            this.DefaultPageTableLayout = new TableLayout({ ComponentList: this.DefaultPropertyComponents })

            return this.DefaultPageTableLayout.GetHtml()
        }

        GetSearchCondition() {
            let conditionList = [];
            let blValidate = true
            let value = "", c = null

            for (let i = 0; i < this.SearchComponents.length; i++) {
                c = this.SearchComponents[i]
                value = c.GetValue()
                if (c.Validate(value, false) === false) {
                    blValidate = false
                    break
                }
                if (!Common.IsNullOrEmpty(value)) {
                    conditionList.push({
                        Name: c.Property.Name,
                        Logic: c.Property.Logic || "=",
                        Value: c.GetValue() || ""
                    })
                }
            }

            if (!blValidate) return false

            this.SearchProperties.filter(f => !f.IsVisible).forEach(p => {
                conditionList.push({
                    Name: p.Name,
                    Logic: p.Logic || "=",
                    Value: p.DefaultValue || ""
                })
            })

            return conditionList;
        }

        SetInitConditionList(conditionList) {
            const condition = {}
            conditionList.forEach(c => condition[c.Name] = c.Value)
            let value = ""
            this.SearchComponents.forEach(c => {
                value = condition[c.Property.Name] === undefined ? "" : condition[c.Property.Name]
                c.SetValue(value)
            })
        }

        GetHeaderInfoList() {
            return this.DataProperties.map((p) => { return { Name: p.Name, Label: p.Label } })
        }

        GetDataGridCheckedValue() {
            return this.DataGridComponent.GetCheckedValue()
        }
    }

})($ns);