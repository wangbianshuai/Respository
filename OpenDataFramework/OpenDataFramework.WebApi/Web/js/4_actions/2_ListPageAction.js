((ns) => {
    const { Index } = ns.actions
    const { Common, HtmlTag } = ns.utils
    const { Dispatch, Connect } = ns.data.Index

    ns.actions.SearchAction = class SearchAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = this.Label || "查询"
            this.PageIndex = this.PageIndex || 1
            this.ConditionList = this.ConditionList || []
            this.InitConditionList = this.InitConditionList || []

            this.Init()
        }

        GetConditionList() {
            this.ConditionList = this.Page.GetSearchCondition()
            return this.ConditionList
        }

        Invoke(e, c) {
            this.PageIndex = 1
            this.Search(e, c, false)
        }

        Search(e, c, p, ids) {
            const { Entity, SelectNames, IsPage, PageSize, KeyName, IsDataRight, IsDataStatus } = this.Page
            if (!p) this.GetConditionList()

            if (this.ConditionList === false) return;

            if (Entity.IsSelectKey) SelectNames.splice(0, 0, Entity.PrimaryKey)
            let request = {
                IsPage: IsPage,
                IsRowVersion: Entity.IsRowVersion === undefined ? true : Entity.IsRowVersion,
                IsDataRight: IsDataRight,
                IsDataStatus: IsDataStatus,
                PageIndex: this.PageIndex,
                PageSize: PageSize,
                SelectNames: SelectNames,
                Conditions: this.ConditionList,
                OrderBys: this.Page.GetOrderByList()
            }

            if (Entity.ExpandQueryRequest) request = Entity.ExpandQueryRequest.call(this, request, ns);
            if (request === false) return;

            let loading = new ns.components.Loading();
            loading.Show();

            this.DispatchAction(() => this.Api.Query(Entity.Name, request))(Dispatch, KeyName + "_Search_Data", (res) => {
                if (ids) res.Ids = ids
            }).then(res => {
                if (res.IsSuccess && res.Data.PageRecord >= 0) this.PageRecord = res.Data.PageRecord
                loading.Close();
            })
        }

        Init() {
            const { Entity } = this.Page

            Connect(state => {
                let keyName = "EditPage_" + Entity.Id

                this.GetDataValue(state, keyName, "EditResponse").then(res => {
                    res && this.SetEditResponse(this.EditResponse)
                })

                keyName = "ListPage_" + Entity.Id

                this.GetDataValue(state, keyName, "ListEditResponse").then(res => {
                    res && this.SetEditResponse(this.ListEditResponse)
                })

                this.GetDataValue(state, this.Page.KeyName, "DeleteResponse").then(res => {
                    res && this.SetDeleteResponse()
                })
            })
        }

        SetEditResponse(res) {
            if (res == null) { return }

            if (res.Ids) {
                if (res.RequestType === "Create") this.InsertRefresh()
                this.Search(null, null, true, res.Ids)
            }
        }

        InsertRefresh() {
            this.Page.SetInitConditionList(this.InitConditionList)
            this.ConditionList = this.InitConditionList.map(c => c)
        }

        ExcelRefresh() {
            this.InsertRefresh()
            this.Search(null, null, true)
        }

        SetDeleteResponse() {
            let res = this.DeleteResponse
            if (res == null) { return }

            const { RowCount } = this.Page.DataGridComponent
            if (res.IsDelete) {
                if (res.RowCount === RowCount && this.PageIndex > 1) this.PageIndex -= 1
                this.Search(null, null, true)
            }
        }
    }

    ns.actions.NewAddAction = class NewAddAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = "新增"
        }

        Invoke(e, c) {
            new ns.pages.EditPage({ Entity: this.Page.Entity, IsDataStatus: this.Page.IsDataStatus }).Load()
        }
    }

    ns.actions.EditAction = class EditAction extends Index {
        constructor(dataGrid) {
            super(dataGrid)

            this.DataGrid = dataGrid
            this.Label = "修改"
        }

        GetText(rowData) {
            if (this.DataGrid.IsDataStatus && rowData.DataStatus === 1) {
                return "查看"
            }
            return this.GetEditText(rowData);
        }

        IsLook(rowData) {
            if (this.DataGrid.IsDataStatus && rowData.DataStatus === 1) {
                return true;
            }
            return false;
        }

        Invoke(e, c) {
            new ns.pages.EditPage({
                Entity: this.DataGrid.Entity,
                IsLocalData: this.DataGrid.IsLocalData,
                SaveData: (d) => this.DataGrid.SaveData(d),
                RowData: c.RowData,
                IsDataStatus: this.DataGrid.IsDataStatus,
                IsLook: this.IsLook(c.RowData),
                IsUpdate: true
            }).Load()
        }
    }

    ns.actions.UpdateStatusAction = class UpdateStatusAction extends Index {
        constructor(dataGrid) {
            super(dataGrid)

            this.DataGrid = dataGrid
            this.Label = ""
        }

        GetText(rowData) {
            let s = rowData.DataStatus;
            const { IsDataRight, LoginUser } = this.DataGrid
            if (IsDataRight) {
                if (!LoginUser) return "";
                let r = LoginUser.DataRight || 1;

                if (rowData.CreateUser === LoginUser.UserId && (s === 0 || s === 2)) return "提交";
                if (r === 3 && s === 1) return "驳回";
            }
            return "";
        }

        Invoke(e, c) {
            let s = c.RowData.DataStatus;
            if (s === 1) return this.Reject(e, c);

            (s === 0 || s === 2) && Common.Confirm("确认提交吗？").then(() => {
                const { Entity, RowCount, KeyName } = this.DataGrid

                let data = {}
                data[Entity.PrimaryKey] = c.RowData[Entity.PrimaryKey]
                data.DataStatus = 1;
                data.RowVersion = c.RowData.RowVersion

                const request = { Data: [data] }

                this.DispatchAction(() => this.Api.Update(Entity.Name, request))(Dispatch, KeyName + "_Update").then(res => {
                    if (!res.IsSuccess) Common.Alert(res.Message)
                })
            });
        }

        Reject(e, c) {
            new ns.pages.EditPage({
                Entity: this.GetRejectEntity(),
                SaveData: (d) => this.DataGrid.SaveData(d),
                RowData: c.RowData,
                IsUpdate: true,
                Title: "驳回" + this.DataGrid.Entity.Label
            }).Load()
        }

        GetRejectEntity() {
            const { Entity, RowCount, KeyName } = this.DataGrid

            return {
                Id: Entity.Id,
                Name: Entity.Name,
                Label: Entity.Label,
                PrimaryKey: Entity.PrimaryKey,
                IsSelectKey: true,
                Properties: [{
                    Name: "RejectReason",
                    Label: "驳回原因",
                    ControlType: "TextArea",
                    MaxLength: 500,
                    IsNullable: false,
                    EditOptions: {
                        X: 1,
                        Y: 1,
                        ControlWidth: 450,
                        Height: 80
                    }
                },
                {
                    Name: "DataStatus",
                    EditOptions: {
                        IsVisible: false
                    }
                }],
                ExpandSetEditData: (data, blUpdate, ns2) => {
                    data.DataStatus = 2;

                    this.CreateRejectReason(data.RejectReason, data[Entity.PrimaryKey])

                    return data
                }
            }
        }

        CreateRejectReason(rejectReason, id) {
            let data = {}
            data.DataId = Common.CreateGuid();
            data.RejectDataId = id;
            if (this.DataGrid.LoginUser) data.UserName = this.DataGrid.LoginUser.UserName + "(" + this.DataGrid.LoginUser.LoginName + ")"
            data.RejectReason = rejectReason

            const request = { Data: [data] }

            this.DispatchAction(() => this.Api.Create("RejectRecord", request))();
        }
    }

    ns.actions.BatchSubmitAction = class BatchSubmitAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = "批量提交"
            this.Width = 80
        }

        Invoke(e, c) {
            const dataList = this.Page.GetDataGridCheckedValue();
            if (dataList.length === 0) {
                Common.Alert("请选择数据行！");
                return;
            }

            let dataList2 = [], dataList3 = [];

            const { IsDataRight, LoginUser } = this.Page
            if (IsDataRight) {
                dataList.forEach(d => {
                    if (LoginUser && d.CreateUser === LoginUser.UserId) dataList2.push(d);
                })
            }
            else dataList2 = dataList;

            if (this.Page.IsDataStatus) {
                dataList2.forEach(d => {
                    if (d.DataStatus !== 1) dataList3.push(d);
                })
            }
            else dataList3 = dataList2;

            if (dataList3.length === 0) {
                Common.Alert("对不起，选择的数据行未有符合可提交的数据！");
                return;
            }

            Common.Confirm("确认提交吗？").then(() => {
                const { Entity, KeyName } = this.Page

                let data = {}, dataList4 = [];

                dataList3.forEach(d => {
                    data = {}
                    data[Entity.PrimaryKey] = d[Entity.PrimaryKey]
                    data.DataStatus = 1;
                    data.RowVersion = d.RowVersion

                    dataList4.push(data);
                });
                const request = { Data: dataList4 }

                this.DispatchAction(() => this.Api.Update(Entity.Name, request))(Dispatch, KeyName + "_Update").then(res => {
                    if (!res.IsSuccess) Common.Alert(res.Message)
                })
            });
        }
    }

    ns.actions.BatchRejectAction = class BatchRejectAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = "批量驳回"
            this.Width = 80
        }

        Invoke(e, c) {
            const dataList = this.Page.GetDataGridCheckedValue();
            if (dataList.length === 0) {
                Common.Alert("请选择数据行！");
                return;
            }

            let dataList2 = [];

            const { LoginUser } = this.Page

            dataList.forEach(d => {
                let r = !LoginUser ? 1 : LoginUser.DataRight || 1;
                if (r === 3 && d.DataStatus === 1) dataList2.push(d);
            })

            if (dataList2.length === 0) {
                Common.Alert("对不起，选择的数据行未有符合可驳回的数据！");
                return;
            }

            c.DataList = dataList2;
            this.Reject(e, c);
        }

        Reject(e, c) {
            let editPage = new ns.pages.EditPage({
                Entity: this.GetRejectEntity(),
                Title: "驳回" + this.Page.Entity.Label,
                OkAction: { Invoke: (e1, c1) => { c1.DataList = c.DataList; this.OkAction(e1, c1, editPage) } }
            });
            editPage.Load()
        }

        OkAction(e, c, editPage) {
            const { Entity, KeyName, EditDialog } = editPage

            let editData = editPage.GetEditData()
            if (editData === false) return

            let dataList = [], idList = [], data = null;
            c.DataList.forEach(d => {
                data = { DataStatus: 2, RowVersion: d.RowVersion }
                data[Entity.PrimaryKey] = d[Entity.PrimaryKey];
                dataList.push(data)
                idList.push(d[Entity.PrimaryKey])
            })

            this.CreateRejectReason(editData.RejectReason, idList);

            this.EditEntityData(c, dataList, true, editPage)
        }

        GetRejectEntity() {
            const { Entity, KeyName } = this.Page

            return {
                Id: Entity.Id,
                Name: Entity.Name,
                Label: Entity.Label,
                PrimaryKey: Entity.PrimaryKey,
                IsSelectKey: true,
                Properties: [{
                    Name: "RejectReason",
                    Label: "驳回原因",
                    ControlType: "TextArea",
                    MaxLength: 500,
                    IsNullable: false,
                    EditOptions: {
                        X: 1,
                        Y: 1,
                        ControlWidth: 450,
                        Height: 80
                    }
                },
                {
                    Name: "DataStatus",
                    EditOptions: {
                        IsVisible: false
                    }
                }]
            }
        }

        CreateRejectReason(rejectReason, idList) {
            let data = {}
            let dataList = [];

            idList.forEach((id) => {
                data = {}
                data.DataId = Common.CreateGuid();
                data.RejectDataId = id;
                if (this.Page.LoginUser) data.UserName = this.Page.LoginUser.UserName + "(" + this.Page.LoginUser.LoginName + ")"
                data.RejectReason = rejectReason

                dataList.push(data)
            })

            const request = { Data: dataList }

            this.DispatchAction(() => this.Api.Create("RejectRecord", request))();
        }
    }

    ns.actions.BatchDeleteAction = class BatchDeleteAction extends Index {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = "批量删除"
            this.Width = 80
        }

        Invoke(e, c) {
            const dataList = this.Page.GetDataGridCheckedValue();
            if (dataList.length === 0) {
                Common.Alert("请选择数据行！");
                return;
            }

            let dataList2 = [], dataList3 = [];

            const { IsDataRight, LoginUser } = this.Page
            if (IsDataRight) {
                dataList.forEach(d => {
                    if (LoginUser && d.CreateUser === LoginUser.UserId) dataList2.push(d);
                })
            }
            else dataList2 = dataList;

            if (this.Page.IsDataStatus) {
                dataList2.forEach(d => {
                    if (d.DataStatus !== 1) dataList3.push(d);
                })
            }
            else dataList3 = dataList2;

            if (dataList3.length === 0) {
                Common.Alert("对不起，选择的数据行未有符合可删除的数据！");
                return;
            }

            Common.Confirm("确认删除吗？").then(() => {
                const { Entity, KeyName } = this.Page

                let dataList4 = [];
                let data = {}

                dataList3.forEach(d => {
                    data = {}
                    data[Entity.PrimaryKey] = d[Entity.PrimaryKey]
                    data.RowVersion = d.RowVersion
                    dataList4.push(data);
                })

                const request = { Data: dataList4 }

                this.DispatchAction(() => this.Api.Delete(Entity.Name, request))(Dispatch, KeyName + "_Delete", res => res.RowCount = dataList4.length).then(res => {
                    if (!res.IsSuccess) Common.Alert(res.Message)
                    else ns.data.Cache.UpdateEntityCacheList(Entity.Name);
                })
            })
        }
    }

    ns.actions.DeleteAction = class DeleteAction extends Index {
        constructor(dataGrid) {
            super(dataGrid)

            this.DataGrid = dataGrid
            this.Label = "删除"
        }

        GetText(rowData) {
            if (this.DataGrid.IsDataStatus && rowData.DataStatus === 1) return "";
            return this.GetEditText(rowData);
        }

        Invoke(e, c) {
            if (this.DataGrid.IsLocalData) {
                this.DataGrid.DeleteData(c.RowData[this.DataGrid.Entity.PrimaryKey])
                return
            }

            Common.Confirm("确认删除吗？").then(() => {
                const { Entity, RowCount, KeyName } = this.DataGrid

                let data = {}
                data[Entity.PrimaryKey] = c.RowData[Entity.PrimaryKey]
                data.RowVersion = c.RowData.RowVersion

                const request = { Data: [data] }

                this.DispatchAction(() => this.Api.Delete(Entity.Name, request))(Dispatch, KeyName + "_Delete", res => res.RowCount = RowCount).then(res => {
                    if (!res.IsSuccess) Common.Alert(res.Message)
                    else ns.data.Cache.UpdateEntityCacheList(Entity.Name);
                })
            })
        }
    }

    ns.actions.PagingAction = class PagingAction extends Index {
        constructor(dataPaging) {
            super(dataPaging)

            this.DataPaging = dataPaging
            this.SearchAction = this.DataPaging.SearchAction
        }

        Invoke(e, c) {
            this.SearchAction.PageIndex = this.GetPageIndex()
            this.SearchAction.Search(e, c, true)
        }

        GetPageIndex() {
            let pageIndex = this.SearchAction.PageIndex
            switch (this.Type) {
                case "First": return 1
                case "Pre": return pageIndex - 1
                case "Next": return pageIndex + 1
                case "Last": return this.DataPaging.PageCount
                default: this.pageIndex
            }
        }
    }

    ns.actions.PagingFirstAction = class PagingFirstAction extends ns.actions.PagingAction {
        constructor(dataPaging) {
            super(dataPaging)

            this.Label = "<<"
            this.Title = "首页"
            this.Type = "First"
        }
    }

    ns.actions.PagingPreAction = class PagingPreAction extends ns.actions.PagingAction {
        constructor(dataPaging) {
            super(dataPaging)

            this.Label = "<"
            this.Title = "上页"
            this.Type = "Pre"
        }
    }

    ns.actions.PagingNextAction = class PagingNextAction extends ns.actions.PagingAction {
        constructor(dataPaging) {
            super(dataPaging)

            this.Label = ">"
            this.Title = "下页"
            this.Type = "Next"
        }
    }

    ns.actions.PagingLastAction = class PagingLastAction extends ns.actions.PagingAction {
        constructor(options) {
            super(options)

            this.Label = ">>"
            this.Title = "尾页"
            this.Type = "Last"
        }
    }

    ns.actions.PagingIndexQueryAction = class PagingIndexQueryAction extends Index {
        constructor(options) {
            super(options)

            this.Label = "确定"

            this.DataPaging = options
            this.SearchAction = this.DataPaging.SearchAction
        }

        Invoke(e, c) {
            let pageIndex = this.DataPaging.GetInputPageIndex()
            if (pageIndex === false) return

            this.SearchAction.PageIndex = pageIndex
            this.SearchAction.Search(e, c, true)
        }
    }

    ns.actions.ExcelExportAction = class ExcelExportAction extends Index {
        constructor(page) {
            super(page)

            this.Label = "Excel导出"
            this.Width = 80
            this.Page = page
            this.SearchAction = page.SearchActions[0]
        }

        Invoke(e, c) {
            if (this.SearchAction.PageRecord > 50000) {
                Common.Alert("对不起，您要导出的数据量超过5万条，请先进行相应的数据筛选！")
                return
            }

            Common.Confirm("确定将数据Excel导出吗？").then(() => this.ExcelExport(c))
        }

        ExcelExport(c) {
            c.SetDisabled(true)

            const { Entity, SelectNames } = this.Page

            const request = {
                IsExcel: true,
                Title: Entity.Label,
                SelectNames: SelectNames,
                Conditions: this.SearchAction.ConditionList,
                OrderBys: this.Page.GetOrderByList(),
                HeaderInfos: this.Page.GetHeaderInfoList()
            }

            this.DispatchAction(() => this.Api.Query(Entity.Name, request))().then(res => {
                c.SetDisabled(false)
                if (res.IsSuccess && res.Data.FileName) this.DownLoad(res.Data.FileName)
                else if (res.Message) Common.Alert(res.Message)
            })
        }

        DownLoad(fileName) {
            var url = "download.aspx?fn=" + fileName
            window.open(url, "_self")
        }
    }

    ns.actions.ExcelImportAction = class ExcelImportAction extends Index {
        constructor(page) {
            super(page)

            this.Label = "Excel导入"
            this.Width = 80
            this.Page = page
            this.SearchAction = page.SearchActions[0]
        }

        Invoke(e, c) {
            new ns.components.ExcelImport({
                Entity: this.Page.Entity,
                SearchAction: this.SearchAction,
                Api: this.Api
            }).Import()
        }
    }

    ns.actions.ChangePasswordAction = class ChangePasswordAction extends Index {
        constructor(page) {
            super(page)

            this.Label = "修改密码"
            this.Page = page

            this.Entity = this.GetUserEntity();
        }

        Invoke(e, c) {
            this.UserId = Common.GetStorage("LoginUserId");
            if (!this.UserId) Common.ToLogin();

            this.EditPage = new ns.pages.EditPage({
                Entity: this.Entity,
                Title: "修改登录密码"
            });

            this.EditPage.Load();
            this.EditPage.EditDialog.OkAction = {
                Invoke: (e1, c1) => {
                    let editData = this.EditPage.GetEditData()
                    if (editData === false) return

                    c1.SetDisabled(true)
                    this.GetUserInfo(editData, c1);
                }
            };
        }

        GetUserInfo(editData, c1) {
            editData.OldLoginPassword = Common.ComputeMd5(editData.OldLoginPassword);
            var conditions = [{ Name: "UserId", Logic: "=", Value: this.UserId }, { Name: "LoginPassword", Logic: "=", Value: editData.OldLoginPassword }];

            this.GetDataList("User", ["UserId"], conditions).then(res => {
                if (res.IsSuccess) {
                    if (res.Data.DataList.length === 1) {
                        this.UpdateUserPassword(editData, c1);
                    }
                    else {
                        Common.Alert("原密码不正确").then(() => c1.SetDisabled(false))
                    }
                }
                else {
                    Common.Alert(res.Message).then(() => c1.SetDisabled(false))
                }
            })
        }

        UpdateUserPassword(editData, c1) {
            delete editData.OldLoginPassword;
            delete editData.AgainLoginPassword;
            editData.LoginPassword = Common.ComputeMd5(editData.LoginPassword);

            const request = { Data: [editData] }
            this.DispatchAction(() => this.Api.Update("User", request))().then(res => {
                if (res.IsSuccess) {
                    Common.Alert("修改成功！").then(() => {
                        this.EditPage.ClearControlValue()
                        this.EditPage.EditDialog.Close()
                    })
                }
                else {
                    Common.Alert(res.Message).then(() => c1.SetDisabled(false))
                }
            })
        }

        GetUserEntity() {
            return {
                Id: "A2FACD99-F429-4833-9173-B5E0CB2BF3F6",
                Name: "User",
                Label: "用户",
                PrimaryKey: "UserId",
                Properties: [{
                    Name: "OldLoginPassword",
                    Label: "原密码",
                    IsNullable: false,
                    ControlType: "Password",
                    MaxLength: 50,
                    EditOptions: {
                        X: 1,
                        Y: 1
                    }
                },
                {
                    Name: "LoginPassword",
                    Label: "新密码",
                    IsNullable: false,
                    ControlType: "Password",
                    MaxLength: 50,
                    EditOptions: {
                        X: 2,
                        Y: 1
                    }
                },
                {
                    Name: "AgainLoginPassword",
                    Label: "确认新密码",
                    ControlType: "Password",
                    MaxLength: 50,
                    EditOptions: {
                        X: 3,
                        Y: 1
                    }
                }],
                ExpandSetEditData: function (data, blUpdate, ns) {
                    const { Common } = ns.utils
                    let message = "", blSucceed = true
                    if (blSucceed && !Common.IsNullOrEmpty(data.LoginPassword) && data.LoginPassword !== data.AgainLoginPassword) {
                        message = "新密码与确认新密码不一致！"
                        blSucceed = false
                    }
                    if (!blSucceed) {
                        Common.Alert(message)
                        return false
                    }
                    return data
                }
            }
        }
    }

    ns.actions.LookRejectRecordAction = class LookRejectRecordAction extends Index {
        constructor(dataGrid) {
            super(dataGrid)

            this.DataGrid = dataGrid
            this.Label = "驳回记录"
        }

        Invoke(e, c) {
            new ns.pages.DialogListPage({
                Width: 880,
                Height: 420,
                GridWidth: 880,
                GridHeight: 380,
                IsPage: false,
                Entity: this.GetRejectRecordEntity(c.RowData)
            }).Load()
        }

        GetRejectRecordEntity(rowData) {
            const id = rowData[this.DataGrid.Entity.PrimaryKey];
            return {
                Name: "RejectRecord",
                Label: "驳回记录",
                PrimaryKey: "DataId",
                Properties: [{
                    Name: "RejectDataId",
                    DefaultValue: id,
                    SearchOptions: {
                        IsVisible: false
                    }
                },
                {
                    Name: "RejectReason",
                    Label: "驳回原因",
                    DataOptions: {
                        X: 1,
                        ColumnWidth: 620
                    }
                },
                {
                    Name: "UserName",
                    Label: "操作人",
                    DataOptions: {
                        X: 2,
                        ColumnWidth: 120
                    }
                },
                {
                    Name: "CreateDate",
                    Label: "操作时间",
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 130
                    }
                }]
            }
        }
    }

    ns.actions.LookOperationLogAction = class LookOperationLogAction extends Index {
        constructor(dataGrid) {
            super(dataGrid)

            this.DataGrid = dataGrid
            this.Label = "查看日志"
        }

        GetText(rowData) {
            const { IsDataRight, LoginUser } = this.DataGrid
            if (IsDataRight) {
                if (!LoginUser) return "";
                let r = LoginUser.DataRight || 1;
                if (r === 3) return "查看日志";
                else return "";
            }
            return "查看日志";
        }

        Invoke(e, c) {
            new ns.pages.DialogListPage({
                Width: 880,
                Height: 420,
                GridWidth: 880,
                GridHeight: 380,
                Entity: this.GetOperationLogEntity(c.RowData)
            }).Load();
        }

        GetOperationLogEntity(rowData, entityName) {
            const id = rowData ? rowData[this.DataGrid.Entity.PrimaryKey] : "";
            return {
                Name: "ViewDataOperationLog",
                Label: "操作日志",
                PrimaryKey: "LogId",
                Properties: [{
                    Name: "PrimaryKey",
                    DefaultValue: id,
                    SearchOptions: {
                        IsVisible: false
                    }
                },
                {
                    Name: "EntityName",
                    DefaultValue: entityName || "",
                    SearchOptions: {
                        IsVisible: false
                    }
                },
                {
                    Name: "TableLogId",
                    IsVisible: false,
                    IsData: true
                },
                {
                    Name: "OperationName",
                    Label: "操作名称",
                    DataOptions: {
                        X: 1,
                        ColumnWidth: 130
                    }
                },
                {
                    Name: "UserName",
                    Label: "操作人",
                    DataOptions: {
                        X: 2,
                        ColumnWidth: 130
                    }
                },
                {
                    Name: "CreateDate",
                    Label: "操作时间",
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 130
                    }
                },
                {
                    Name: "LookDetail",
                    Label: "详细",
                    DataOptions: {
                        X: 4,
                        ColumnWidth: 130,
                        ActionInvoke: (e, c) => {
                            this.LookDetailLog(c.RowData)
                        },
                        ControlType: "LinkButton",
                        TextAlign: "center",
                    }
                }]
            }
        }

        LookDetailLog(rowData) {
            new ns.pages.DialogListPage({
                Width: 880,
                Height: 420,
                GridWidth: 880,
                GridHeight: 380,
                IsPage: false,
                Title: "属性变更明细",
                Entity: this.GetOperationFieldLogEntity(rowData)
            }).Load();
        }

        GetOperationFieldLogEntity(rowData) {
            const id = rowData.TableLogId;
            return {
                Name: "DataOperationFieldLog",
                Label: "操作日志",
                PrimaryKey: "FieldLogId",
                OrderByList: [],
                Properties: [{
                    Name: "TableLogId",
                    DefaultValue: id,
                    SearchOptions: {
                        IsVisible: false
                    }
                },
                {
                    Name: "FieldName",
                    Label: "属性名",
                    DataOptions: {
                        X: 1,
                        ColumnWidth: 150
                    }
                },
                {
                    Name: "OldValue",
                    Label: "旧值",
                    DataOptions: {
                        X: 2,
                        ColumnWidth: 350
                    }
                },
                {
                    Name: "NewValue",
                    Label: "新值",
                    DataOptions: {
                        X: 3,
                        ColumnWidth: 350
                    }
                }]
            }
        }
    }

    ns.actions.LookOperationLogAction2 = class LookOperationLogAction2 extends ns.actions.LookOperationLogAction {
        constructor(page) {
            super(page)

            this.Page = page
            this.Label = "操作日志"
            this.Width = 80
        }

        Invoke(e, c) {
            new ns.pages.DialogListPage({
                Width: 880,
                Height: 420,
                GridWidth: 880,
                GridHeight: 380,
                Entity: this.GetOperationLogEntity(null, this.Page.Entity.Name)
            }).Load();
        }
    }

})($ns);