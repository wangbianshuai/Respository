const PageEntityConfigs = {
    Name: "操作日志",
    PageName: "ListPage",
    IsPage: true,
    IsDataRight: false,
    IsDataStatus: false,
    IsNewAdd: false,
    IsEdit: false,
    IsDelete2: false,
    IsExcelExport: false,
    IsExcelImport: false,
    IsLookLog: false,
    Entity: {
        Name: "OperationLog",
        Label: "操作日志",
        PrimaryKey: "LogId",
        IsSelectKey: true,
        Properties: [{
            Name: "LogType",
            Label: "类型",
            ControlType: "DownList",
            Options: [{ Value: "Success", Text: "成功" }, { Value: "Message", Text: "信息" }, { Value: "Exception", Text: "异常" }],
            SearchOptions: {
                X: 1,
                Y: 1,
                ControlWidth: 150,
            },
            DataOptions: {
                X: 1
            }
        },
        {
            Name: "RequestType",
            Label: "请求类型",
            ControlType: "DownList",
            Options: [{ Value: "Query", Text: "查询" }, { Value: "Create", Text: "创建" }, { Value: "Update", Text: "更新" }, { Value: "Delete", Text: "删除" }],
            SearchOptions: {
                X: 1,
                Y: 2,
                ControlWidth: 150,
            },
            DataOptions: {
                X: 2
            }
        },
        {
            Name: "EntityName",
            Label: "表单名称",
            ControlType: "TextBox",
            MaxLength: 50,
            SearchOptions: {
                X: 1,
                Y: 3,
                ControlWidth: 150,
                Logic: "like"
            },
            DataOptions: {
                X: 3
            }
        },
        {
            Name: "CreateDate",
            Label: "操作日期",
            DataType: "date",
            ControlType: "TextDate",
            MaxLength: 50,
            SearchOptions: {
                X: 2,
                Y: 1,
                ControlWidth: 150,
                Logic: ">="
            }
        },
        {
            Name: "CreateDate",
            Label: "至",
            DataType: "date",
            ControlType: "TextDate",
            MaxLength: 50,
            SearchOptions: {
                X: 2,
                Y: 1,
                ControlWidth: 150,
                Logic: "<"
            }
        },
        {
            Name: "IPAddress",
            Label: "IP地址",
            DataOptions: {
                X: 4
            }
        },
        {
            Name: "StartTime",
            Label: "开始时间",
            DataOptions: {
                X: 5
            }
        },
        {
            Name: "EndTime",
            Label: "结束时间",
            DataOptions: {
                X: 6
            }
        },
        {
            Name: "ElapsedMilliseconds",
            Label: "耗时(毫秒)",
            DataOptions: {
                X: 7
            }
        },
        {
            Name: "CreateDate",
            Label: "操作时间",
            DataOptions: {
                X: 8
            }
        },
        {
            Name: "LogPath",
            Label: "LogPath",
            IsData: true,
            IsVisible: false
        },
        {
            Name: "LookDetail",
            Label: "详细",
            DataOptions: {
                ActionInvoke: (e, c) => {
                    var url = "OperationLog.aspx?Path=" + escape(c.RowData.LogPath);
                    window.open(url);
                },
                ControlType: "LinkButton",
                TextAlign: "center",
                X: 9
            }
        }],
        ExpandPageInit: function (ns) {
            var list = this.Entity.Properties.filter(f => f.Name === "CreateDate" && f.IsSearch)
            list.forEach(p => {
                let ds = ns.utils.Common.GetDateString(new Date(), true);
                if (p.Label === "操作日期") p.DefaultValue = ds.substring(0, 8) + "01";
                else if (p.Label === "至") p.DefaultValue = ds;
            })
        },
        ExpandQueryRequest: function (request, ns) {
            var list = request.Conditions.filter(f => f.Name === "CreateDate");
            if (list.length == 2) {
                var startDate, endDate;
                list.forEach(p => {
                    if (p.Logic === ">=") startDate = p.Value;
                    else if (p.Logic === "<") endDate = p.Value;
                })
                if (startDate && endDate && startDate > endDate) {
                    ns.utils.Common.Alert("对不起，开始日期不能大于结束日期！");
                    return false;
                }
            }
            return request;
        }
    }
}