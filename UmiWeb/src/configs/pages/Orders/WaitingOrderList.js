import Order from "../../entities/Order";
import { GetButton, AssignProporties, CreateGuid, GetRadio, GetTextBox, GetSelect, GetSelect2 } from "../Common";

const DataActionTypes = {
    //搜索查询
    SearchQuery: 300,
    //处理
    HandlerOrder: 301,
    //挂起
    HandUpOrder: 302
};

export default {
    Name: "WaitingOrderList",
    Type: "View",
    EventActions: GetEventActions(),
    DialogViews: GetDialogViews(),
    Properties: AssignProporties(Order, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Id: CreateGuid(),
        Name: "SearchOperationView1",
        Entity: Order,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(Order, [{ EventActionName: "HandlerOrderToPage", ...GetButton("HandlerOrder", "处理", "primary", 1, 1) },
        {
            EventActionName: "HandUpOrder", DataActionType: DataActionTypes.HandUpOrder,
            ColStyle: { paddingLeft: 0 },
            SuccessTip: "挂起完成，请前往我的工单-已挂起查看！",
            ConfirmTip: "请确认当前工单是否挂起？",
            ...GetButton("HandUpOrder", "挂起", "default", 1, 2)
        },
        GetQueryName(),
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.EventActionName = "SearchQuery";
    p.PressEnterEventActionName = "SearchQuery";
    p.ColStyle = { width: 240 }
    return p;
}

function GetQueryName() {
    const p = GetSelect("QueryName", "", Order.QueryNameDataSource, 2, 2, "loanApplyId");
    p.ColStyle = { paddingRight: 0, paddingLeft: 8 };
    p.Width = 100;
    p.IsCondition = true;
    return p;
}

function GetAlert() {
    return {
        Name: "AlertMessage",
        Type: "Alert"
    }
}

function GetDataGridView() {
    return {
        Id: CreateGuid(),
        Name: "DataGridView1",
        Entity: Order,
        Type: "DataGridView",
        EventActionName: "SearchQuery",
        EntitySearchQuery: DataActionTypes.SearchQuery,//对应具体业务 数据行为类型 300:搜索查询
        Title: "工单列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(Order, [GetOrderCode(), "Borrowers", "BorrowerUser", "ProductType", "LoanUser", "BorrowerDate", "UpdateDate", "OrderStatus"])
    }
}

function GetOrderCode() {
    return {
        Name: "OrderCode",
        IsOpenPage: true,
        PageUrl: "/risk/CreditManage/OrderDetail.html?OrderCode=#{loanApplyId}"
    }
}

function GetEventActions() {
    return [{
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "Keyword",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    },
    {
        Name: "SetApproveUsers",
        Type: "Dialog/SelectViewDataToList",
        DialogView: "SelectDataToListView",
        DataProperties: ["ApproveUserList", "HandlerType"],
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    },
    {
        Name: "HandlerOrderToPage",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        SetPageUrl:"HandlerOrderSetPageUrl"
    },
    {
        Name: "AddUser",
        Type: "DataListView/Add",
        DataListView: "ApproveUserList",
        SelectDataProperty: "UserList"
    },
    {
        Name: "RemoveUser",
        Type: "DataListView/Remove",
        DataListView: "ApproveUserList"
    },
    {
        Name: "HandUpOrder",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}

function GetDialogViews() {
    return [{
        Id: CreateGuid(),
        DialogId: CreateGuid(),
        Name: "SelectDataToListView",
        Entity: Order,
        Type: "RowsColsView",
        DialogTitle: "配置",
        DialogWidth: 600,
        SuccessTip: "处理成功！",
        ClassName: "DivView2",
        SetSelectValuesOkActionType: DataActionTypes.HandlerOrder,//对应具体业务 数据行为类型 301:处理
        DialogStyle: { height: 400, overflow: "auto" },
        Properties: AssignProporties(Order, [
            { ...GetRadio("HandlerType", "贷审会规则", GetHandlerTypeDataSource(), 1, 1, "0", 120), ColSpan: 19, IsFormItem: true },
            { ...GetSelect2("UserList", "审核成员", GetUserListDataSource(), 2, 1), PlaceHolder: "可输入关键字检索", AllowClear: true, IsSearch: true, ColSpan: 19, IsFormItem: true },
            { ...GetButton("AddUser", "添加", "default", 2, 2), Icon: "plus", ColSpan: 5, EventActionName: "AddUser", IsFormItem: true },
            GetDataListView(),
            {
                Name: "BottomTip",
                Type: "SpanText",
                Text: "重要提醒：背对背规则，邀请参与贷审会成员必须是奇数位，且至少邀请3个人",
                Style: { color: "red", marginTop: 30, display: "block" }
            }
        ])
    }]
}

function GetDataListView() {
    return {
        Name: "ApproveUserList",
        Type: "DataListView",
        PrimaryKey: "UserId",
        ItemProps: {
            style: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }
        },
        ColSpan: 24,
        ListProps: { bordered: true },
        Properties: AssignProporties({}, [{
            Name: "UserName",
            Type: "SpanText"
        },
        {
            Name: "Delete",
            Type: "Button",
            Icon: "close",
            Shape: "circle",
            Size: "small",
            EventActionName: "RemoveUser",
            Style: { border: 0 }
        }])
    }
}

function GetHandlerTypeDataSource() {
    return [{ Value: "0", Text: "背对背" }, { Value: "1", Text: "集体" }]
}

function GetUserListDataSource() {
    return {
        ValueName: "UserId",
        TextName: "UserName",
        StateName: "UserList",
        ServiceName: "ApiService",
        ActionName: "GetUserList",
        Payload: {}
    }
}