const RequestServiceLog = require("../../entities/RequestServiceLog");
const { GetButton, AssignProporties, GetSelect2, GetSelect, GetDatePicker } = require("../../Common");

//系统管理/请求服务日志 400-499
const DataActionTypes = {
    //搜索查询
    SearchQuery: 400,
    //删除实体数据
    DeleteEntityData: 401,
    //Excel导出
    ExcelExport: 402,
    //重发
    ReSend: 403
};

const Entity = { Name: RequestServiceLog.Name, PrimaryKey: RequestServiceLog.PrimaryKey, ViewName: "ViewRequestServiceLog" }

module.exports = {
    Name: "RequestServiceLog",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "RequestServiceLog" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "RequestServiceLog" }, [
            GetEditSelect("LogType", "类型", GetLoyTypeDataSource(), 1, 1),
            GetEditSelect("IsReSend", "是否重发记录", RequestServiceLog.IsReSendDataSource, 1, 2),
            GetEditSelect2("ServiceInterfaceId", "服务接口", RequestServiceLog.ServiceInterfaceDataSource, 1, 3),
            { ...GetDatePicker2("StartDate", "开始日期", 2, 1, "大于或等于其值"), IsMonthFirst: true, PropertyName: "CreateDate", OperateLogic: ">=" },
            { ...GetDatePicker2("EndDate", "至", 2, 2, "小于其值"), IsCurrentDay: true, PropertyName: "CreateDate", OperateLogic: "<" },
            { ...GetButton("Search", "搜索", "primary", 2, 3), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 2, 4), IsFormItem: true, EventActionName: "ClearQuery" },
            {
                EventActionName: "ReSend", ...GetButton("ReSend", "重发", "primary", 3, 1), Style: { marginLeft: 16, marginBottom: 16 },
                DataActionType: DataActionTypes.ReSend,
                SuccessTip: "重发成功！",
                ConfirmTip: "请确认是否重发选择请求服务？",
            },
        ])
    }
}

function GetEditSelect2(Name, Label, ServiceDataSource, X, Y, DefaultValue) {
    return {
        ...GetSelect2(Name, Label, ServiceDataSource, X, Y, DefaultValue),
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

function GetLoyTypeDataSource() {
    return [{ Value: "1", Text: "成功" }, { Value: "2", Text: "失败" }]
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
        IsRowSelection: true,
        ClassName: "DivInfoView3",
        Properties: AssignProporties(RequestServiceLog, ["LogTypeName", "ServiceInterfaceName", "ReSendCount", "IsReSendName", "StartTime", "EndTime", "ElapsedMilliseconds",
            { Name: "CreateDate", OrderByType: "desc" }, GetOperation()])
    }
}

function GetOperation() {
    return {
        Name: "Operation",
        Label: "操作",
        IsData: false,
        ActionList: AssignProporties(RequestServiceLog, [LookDetail()])
    }
}

function LookDetail() {
    return {
        Name: "LookDetail",
        Label: "查看",
        EventActionName: "LookDetail",
        Type: "AButton"
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
        Name: "LookDetail",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        PageUrl: "/SystemManage/RequestServiceLogEdit?Id=#{Id}&MenuName=" + escape("查看")
    },
    {
        Name: "ReSend",
        Type: "DataGrid/BatchUpdateRowDataList",
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
