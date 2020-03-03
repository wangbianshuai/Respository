const OperationLog = require("../../entities/OperationLog");
const { GetButton, AssignProporties, GetTextBox, GetSelect, GetDatePicker } = require("../../Common");

//系统管理/操作日志 4200-4299
const DataActionTypes = {
    //搜索查询
    SearchQuery: 4200,
};

const Entity = { Name: OperationLog.Name, PrimaryKey: OperationLog.PrimaryKey, ViewName: "ViewOperationLog" }

module.exports = {
    Name: "OperationLog",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "OperationLog" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "OperationLog" }, [
            GetEditSelect("LogType", "类型", GetLoyTypeDataSource(), 1, 1),
            GetEditSelect("RequestType", "请求类型", GetRequestDataSource(), 1, 2),
            GetTextBox2("EntityName", "实体名", 1, 3),
            GetTextBox2("MethodName", "方法名", 1, 4),
            { ...GetDatePicker2("StartDate", "开始日期", 2, 1, "大于或等于其值"), IsMonthFirst: true, PropertyName: "CreateDate", OperateLogic: ">=" },
            { ...GetDatePicker2("EndDate", "至", 2, 2, "小于其值"), IsCurrentDay: true, PropertyName: "CreateDate", OperateLogic: "<" },
            { ...GetButton("Search", "搜索", "primary", 2, 3), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 2, 4), IsFormItem: true, EventActionName: "ClearQuery" }
        ])
    }
}

function GetRequestDataSource() {
    return [{ Value: "POST", Text: "POST" }, { Value: "PUT", Text: "PUT" }, { Value: "GET", Text: "GET" }, { Value: "DELETE", Text: "DELETE" }]
}

function GetLoyTypeDataSource() {
    return [{ Value: "Success", Text: "成功" }, { Value: "Message", Text: "信息" }, { Value: "Exception", Text: "异常" }]
}

function GetEditSelect(Name, Label, DataSource, X, Y, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 6,
        LabelCol: 8,
        WrapperCol: 15,
        OperateLogic: "=",
        IsNullable: true,
        AllowClear: true,
        IsCondition: true
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        IsFormItem: true,
        ColSpan: 6,
        LabelCol: 8,
        WrapperCol: 15,
        OperateLogic: "=",
        IsNullable: true,
        IsCondition: true
    }
}


function GetDatePicker2(Name, Label, X, Y, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsFormItem: true, ColSpan: 6,
        IsNullable: true,
        PlaceHolder: PlaceHolder,
        MaxLength: 20,
        LabelCol: 8,
        WrapperCol: 15,
        DataType: "DateTime",
        IsCondition: true
    }
}

function GetDataGridView() {
    return {
        Name: "DataGridView1",
        Entity: Entity,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        IsDiv: true,
        ClassName: "DivInfoView3",
        Properties: AssignProporties(OperationLog, ["LogType", "RequestType", "EntityName", "MethodName", "IPAddress", "StartTime", "EndTime", "ElapsedMilliseconds", "UserName",
            { Name: "CreateDate", OrderByType: "desc" }, GetLookDetail(), { Name: "LogPath", IsVisible: false }])
    }
}

function GetLookDetail() {
    return {
        Name: "LookDetail",
        IsOpenPage: true,
        PageUrl: "/OperationLog.aspx?Path=#{LogPath}"
    }
}

function GetEventActions() {
    return [{
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "Search",
        DataGridView: "DataGridView1"
    },
    {
        Name: "ClearQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "ClearQuery",
        DataGridView: "DataGridView1",
        IsClearQuery: true
    }]
}
