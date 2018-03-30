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
        ActionList: GetActionList(),
        OperationProperties: GetOperationProperties()
    };

    function GetOperationProperties() {
        return [{
            Name: "GenPdfAction",
            Type: "Button",
            Text: "生成PDF",
            Icon: "file-pdf",
            ActionType: "ExpandPage",
            ActionName: "Publish",
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
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate", DataKey: "ViewUser", Method: "GET"
        }]
    }

})();