(function () {
    window.configs.OrderEdit = {
        Name: "OrderEdit",
        Title: "订单编辑",
        EntityName: "Order",
        PrimaryKey: "OrderId",
        TemplateName: "TabsEntityEditPage",
        InsertUrl: "Order/Insert2",
        UpdateUrl: "Order/Update2",
        GetEntityDataUrl: "Order/GetOrder",
        UpdateStatusUrl: "Order/UpdateStatus",
        UpdateStatusActionName: "UpdateStatus",
        ActionList: GetActionList(),
        OperationProperties: GetOperationProperties(),
        TabViews: [GetOrderView(), GetOrderDetailView(), GetOrderImageView()]
    };

    function GetOperationProperties() {
        return [{
            Name: "UpdateStatus1Action",
            Type: "Button",
            Text: "提交加工",
            Icon: "check",
            ActionType: "EntityEdit",
            ActionName: "UpdateStatus2",
            ConfirmMessage: "确定要提交加工吗？",
            StatusName: "OrderStatus",
            StatusValue: 1,
            IsEditEnable: true,
            IsVisible: false
        },
        {
            Name: "UpdateStatus2Action",
            Type: "Button",
            Text: "存档完成",
            Icon: "check",
            ActionType: "EntityEdit",
            ActionName: "UpdateStatus2",
            ConfirmMessage: "确定要存档完成吗？",
            StatusName: "OrderStatus",
            StatusValue: 2,
            IsEditEnable: true,
            IsVisible: false
        },
        {
            Name: "CheckPrcoessAmountAction",
            Type: "Button",
            Text: "审核加工费",
            Icon: "check",
            Icon: "check",
            ActionType: "EntityEdit",
            ActionName: "UpdateStatus2",
            StatusName: "OrderStatus",
            StatusValue: 3,
            IsEditEnable: true,
            IsVisible: false
        },
        {
            Name: "UpdateStatus0Action",
            Type: "Button",
            Text: "撤回",
            Icon: "edit",
            ActionType: "EntityEdit",
            ActionName: "UpdateStatus2",
            ConfirmMessage: "确定要撤回吗？",
            StatusName: "OrderStatus",
            StatusValue: 0,
            IsEditEnable: true,
            IsVisible: false
        },
        {
            Name: "BillAction",
            Type: "Button",
            Text: "收支明细",
            Icon: "link",
            ActionType: "ExpandPage",
            ActionName: "ToBill",
            IsEditEnable: true,
            IsVisible: false
        },
        {
            Name: "OrderPdfAction",
            Type: "Button",
            Text: "订单Pdf",
            Icon: "file-pdf",
            ActionType: "ExpandPage",
            ActionName: "OrderPdf",
            IsEditEnable: true,
            IsVisible: false
        },
        {
            Name: "ProcessOrderPdfAction",
            Type: "Button",
            Text: "加工单Pdf",
            Icon: "file-pdf",
            ActionType: "ExpandPage",
            ActionName: "ProcessOrderPdf",
            IsEditEnable: true,
            IsVisible: false
        }]
    }

    function GetActionList() {
        return [{
            ActionName: "GetCustomerList", StateName: "CustomerList",
            Url: "ViewCustomer?$select=Id,Name&$orderby=CreateDate", DataKey: "ViewCustomer", Method: "GET"
        },
        {
            ActionName: "UpdateStatus", StateName: "UpdateStatusInfo", DataKey: "", Method: "PUT"
        },
        {
            ActionName: "GetTemplateHtmlList", StateName: "TemplateHtmlList",
            Url: "ViewTemplateHtml?$select=Id,Name&$orderby=CreateDate", DataKey: "ViewTemplateHtml", Method: "GET"
        },
        {
            ActionName: "GetProcessItemList", StateName: "ProcessItemList",
            Url: "ViewProcessItem?$select=Id,Name&$orderby=DisplayIndex", DataKey: "ViewProcessItem", Method: "GET"
        },
        {
            ActionName: "GetRemarkItemList", StateName: "RemarkItemList",
            Url: "ViewRemarkItem?$select=Id,Name&$orderby=DisplayIndex", DataKey: "ViewRemarkItem", Method: "GET"
        },
        {
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate&$filter=DataRight eq 1", DataKey: "ViewUser", Method: "GET"
        }]
    }

    function GetCustomerListDataSource() {
        return {
            ActionName: "GetCustomerList",
            ValueName: "Id",
            TextName: "Name"
        }
    }

    function GetUserDataSource() {
        return {
            ActionName: "GetUserList",
            ValueName: "UserId",
            TextName: "UserName"
        }
    }

    function GetOrderView() {
        return {
            Name: "Order",
            TabLabel: "订单信息",
            IsTabView: true,
            TemplateName: "EntityEditPage",
            Properties: GetOrderPropeties()
        }
    }

    function GetOrderPropeties() {
        return [{ Label: "订单编号", Name: "OrderCode", ColSpan: 11, LabelCol: 4, WrapperCol: 20, Type: "TextBox", X: 1, Y: 1, DataType: "string", MaxLength: 50, IsNullable: true, PlaceHolder: "默认自动生成订单编号" },
        {
            Label: "客户", Name: "CustomerId", X: 1, Y: 2,
            AllowClear: true,
            ColSpan: 11, LabelCol: 4, WrapperCol: 20,
            DataType: "Guid", Type: "Select", ServiceDataSource: GetCustomerListDataSource(), IsNullable: false
        },
        { Label: "门板花式", Type: "TextBox", Name: "OrderName", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 2, Y: 1, DataType: "string", MaxLength: 100, IsNullable: false },
        {
            Label: "销售员", Name: "SaleUser", PlaceHolder: "默认当前用户",
            DataType: "Guid", Type: "Select", ServiceDataSource: GetUserDataSource(), ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 2, Y: 2, IsNullable: true
        },
        { Label: "订单日期", Type: "Date", Name: "OrderDate", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 3, Y: 1, PlaceHolder: "默认系统当前日期", DataType: "DateTime", MaxLength: 10, IsNullable: true },
        { Label: "发货日期", Type: "Date", Name: "DeliveryDate", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 3, Y: 2, DataType: "DateTime", MaxLength: 10, IsNullable: true },
        {
            Label: "订单模板", Name: "OrderTemplateHtmlId", X: 4, Y: 1,
            AllowClear: true,
            ColSpan: 11, LabelCol: 4, WrapperCol: 20,
            DataType: "Guid", Type: "Select", ServiceDataSource: GetTemplateHtmlDataSource()
        },
        {
            Label: "加工单模板", Name: "ProcessTemplateHtmlId", X: 4, Y: 2,
            AllowClear: true,
            ColSpan: 11, LabelCol: 4, WrapperCol: 20,
            DataType: "Guid", Type: "Select", ServiceDataSource: GetTemplateHtmlDataSource()
        },
        { Label: "明细总金额", Max: 100000000, Min: 0, Step: 1, IsReadonly: true, PlaceHolder: "只读，计算其值", Type: "TextBox", ControlType: "InputNumber", Name: "Amount", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 6, Y: 1, DataType: "int", MaxLength: 10, IsNullable: true },
        { Label: "折扣比(%)", Max: 100, Min: 0, Step: 1, PlaceHolder: "百份比1~100之间值", Type: "TextBox", ControlType: "InputNumber", Name: "DiscountRate", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 6, Y: 2, DataType: "int", MaxLength: 10, IsNullable: true },
        { Label: "附加费", Max: 100000000, Min: 0, Step: 1, IsReadonly: true, PlaceHolder: "只读，计算其值", Type: "TextBox", ControlType: "InputNumber", Name: "ExtraCharge", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 7, Y: 1, DataType: "int", MaxLength: 10, IsNullable: true },
        { Label: "订单金额", Max: 100000000, Min: 0, Step: 1, PlaceHolder: "订单金额=明细总金额*折扣比+附加费", Type: "TextBox", ControlType: "InputNumber", Name: "ActualAmount", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 7, Y: 2, DataType: "int", MaxLength: 10, IsNullable: false },
        { Label: "成本金额", Max: 100000000, Min: 0, Step: 1, Type: "TextBox", ControlType: "InputNumber", Name: "CostAmount", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 8, Y: 1, DataType: "int", MaxLength: 10, IsNullable: true },
        { Label: "加工费", Max: 100000000, Min: 0, Step: 1, IsReadonly: true, PlaceHolder: "只读", Type: "TextBox", ControlType: "InputNumber", Name: "ProcessAmount", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 8, Y: 2, DataType: "int", MaxLength: 10, IsNullable: true },
        { Label: "利润", Max: 100000000, Step: 1, IsReadonly: true, PlaceHolder: "只读，利润=订单金额-成本金额-加工费", Type: "TextBox", ControlType: "InputNumber", Name: "Profit", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 9, Y: 1, DataType: "int", MaxLength: 10, IsNullable: true },
        { Label: "已收金额", Max: 100000000, Min: 0, Step: 1, Type: "TextBox", ControlType: "InputNumber", Name: "PaidDeposit", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 9, Y: 2, DataType: "int", MaxLength: 10, IsNullable: true },
        { Label: "应收余额", Max: 100000000, Min: 0, Step: 1, Type: "TextBox", IsReadonly: true, PlaceHolder: "只读，计算其值", ControlType: "InputNumber", Name: "ShouldPayBalance", ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 10, Y: 1, DataType: "int", MaxLength: 10, IsNullable: true },
        {
            Label: "订单状态", Name: "OrderStatus", IsReadonly: true, PlaceHolder: "只读",
            DataType: "int", Type: "Select", DataSource: GetStatusDataSource(), ColSpan: 11, LabelCol: 4, WrapperCol: 20, X: 10, Y: 2
        },
        { Label: "备注", Name: "Remark", X: 11, Y: 1, Type: "TextBox", MaxLength: 200, DataType: "string", ColSpan: 22, LabelCol: 2, WrapperCol: 22, Rows: 3, ControlType: "TextArea", IsNullable: true }]
    }

    function GetOrderDetailView() {
        return {
            Name: "OrderDetail",
            TabLabel: "订单明细",
            IsTabView: true,
            PageComponentName: "OrderDetail"
        }
    }

    function GetOrderImageView() {
        return {
            Name: "OrderImage",
            TabLabel: "订单设计图",
            IsTabView: true,
            PageComponentName: "OrderImage"
        }
    }

    function GetTemplateHtmlDataSource() {
        return {
            ActionName: "GetTemplateHtmlList",
            ValueName: "Id",
            TextName: "Name"
        }
    }

    function GetStatusDataSource() {
        return [{ Value: "0", Text: "未确认" },
        { Value: "1", Text: "已确认" },
        { Value: "2", Text: "已完成" }]
    }

})();