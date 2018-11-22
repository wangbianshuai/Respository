(function () {
    window.configs.OperationLog = {
        Name: "OperationLog",
        Title: "操作日志",
        EntityName: "OperationLog",
        PrimaryKey: "LogId",
        TemplateName: "EntityListPage",
        SelectNames: ["LogId", "LogType", "LogPath", "EntityName", "PdfPath", "RequestType", "MethodName", "IPAddress", "StartTime", "EndTime", "ElapsedMilliseconds", "LookDetail", "UserName", "CreateDate"],
        SearchNames: ["LogType", "RequestType", "EntityName", "MethodName", "StartDate", "EndDate"],
        DataColumnNames: ["LogType", "RequestType", "EntityName", "MethodName", "IPAddress", "StartTime", "EndTime", "ElapsedMilliseconds", "UserName", "CreateDate", "LookDetail"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties(),
        IsNewAdd: false,
        IsUpdate: false,
        IsDelete: false,
        TableWidth: 1000
    };

    function GetProperties() {
        return [{
            Label: "类型", Name: "LogType", AllowClear: true, OperateLogic: "=", SearchProperty: { ColSpan: 5, X: 1, Y: 1 },
            DataType: "string", Type: "Select", DataSource: GetTypeDataSource()
        },
        {
            Label: "请求类型", Name: "RequestType", SearchProperty: { ColSpan: 5, X: 1, Y: 2 },
            DataType: "string", Type: "Select", DataSource: GetRequestDataSource(), OperateLogic: "=", AllowClear: true
        },
        { Label: "实体名", Name: "EntityName", DataType: "string", SearchProperty: { ColSpan: 5, X: 1, Y: 3 }, MaxLength: 50 },
        { Label: "方法名", Name: "MethodName", DataType: "string", SearchProperty: { ColSpan: 5, X: 1, Y: 4 }, MaxLength: 50 },
        { Label: "开始日期", Type: "Date", IsMonthFirst: true, SearchProperty: { ColSpan: 5, X: 2, Y: 1 }, OperateLogic: ">=", PropertyName: "CreateDate", Name: "StartDate", PlaceHolder: "大于或等于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "至", Type: "Date", IsCurrentDay: true, SearchProperty: { ColSpan: 5, X: 2, Y: 2 }, OperateLogic: "<", PropertyName: "CreateDate", Name: "EndDate", PlaceHolder: "小于其值", DataType: "DateTime", MaxLength: 20, IsNullable: true },
        { Label: "IP地址", Name: "IPAddress" },
        { Label: "开始时间", Name: "StartTime" },
        { Label: "结束时间", Name: "EndTime" },
        { Label: "操作人", Name: "UserName" },
        { Label: "操作时间", Name: "CreateUser" },
        { Label: "详细", Name: "LookDetail", IsOpenPage: true, IsRandom: false, PropertyName: "LogPath", PageUrl: "OperationLog.aspx?Path={LogPath}", DataType: "string" },
        { Label: "耗时(毫秒)", Name: "ElapsedMilliseconds" }]
    }

    function GetRequestDataSource() {
        return [{ Value: "POST", Text: "POST" }, { Value: "PUT", Text: "PUT" }, { Value: "GET", Text: "GET" }, { Value: "DELETE", Text: "DELETE" }]
    }

    function GetTypeDataSource() {
        return [{ Value: "Success", Text: "成功" }, { Value: "Info", Text: "信息" }, { Value: "Exception", Text: "异常" }]
    }

})();

